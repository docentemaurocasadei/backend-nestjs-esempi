import { Injectable, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'database/database.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Injectable()
export class ProductsService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {

  }
  create(createProductDto: CreateProductDto) {
    return this.databaseService.query(
      'INSERT INTO products (name, description, base_price) VALUES (?, ?, ?)',
      [createProductDto.name, createProductDto.description, createProductDto.base_price],
    );
  }
  
  findAll() {
    return this.databaseService.query('SELECT * FROM products join product_images on products.id = product_images.product_id');
  }

  async findOne(id: number) {
    const products = await this.databaseService.query(
      `
      SELECT *
      FROM products
      LEFT JOIN product_images
        ON products.id = product_images.product_id
      WHERE products.id = ?
      LIMIT 1
      `,
      [id],
    );

    return products[0];
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
