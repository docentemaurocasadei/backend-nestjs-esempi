import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createProductDto: CreateProductDto) {
    return this.databaseService.query(
      'INSERT INTO products (name, description, base_price) VALUES (?, ?, ?)',
      [createProductDto.name, createProductDto.description, createProductDto.base_price],
    );
  }

  findAll() {
    return this.databaseService.query(
      'SELECT p.*, pi.image_path FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id',
    );
  }

  findOne(id: number) {
    return this.databaseService.query(
      'SELECT p.*, pi.image_path FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id WHERE p.id = ?',
      [id],
    );
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.databaseService.query(
      'UPDATE products SET name = ?, description = ?, base_price = ? WHERE id = ?',
      [updateProductDto.name, updateProductDto.description, updateProductDto.base_price, id],
    );
  }

  remove(id: number) {
    return this.databaseService.query('DELETE FROM products WHERE id = ?', [id]);
  }
}
