import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MysqlService } from 'src/database/mysql/mysql.service';

@Injectable()
export class ProductsService {
  constructor(private readonly mysqlService: MysqlService) { }
  create(createProductDto: CreateProductDto) {
    return this.mysqlService.query(
      "INSERT INTO products (name, description, base_price, slug) VALUES (?, ?, ?, ?)",
      [createProductDto.name, createProductDto.description, createProductDto.base_price, createProductDto.slug]
    );
  }

  findAll() {
    return this.mysqlService.query("SELECT * FROM products p join product_image pi on pi.product_id=p.id");
  }

  findOne(id: number) {
    return this.mysqlService.query("SELECT * FROM products p join product_image pi on pi.product_id=p.id WHERE p.id = ?", [id]);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.mysqlService.query(
      "UPDATE products SET name = ?, description = ?, base_price = ?, slug = ? WHERE id = ?",
      [updateProductDto.name, updateProductDto.description, updateProductDto.base_price, updateProductDto.slug, id]
    );
  }

  remove(id: number) {
    return this.mysqlService.query("DELETE FROM products WHERE id = ?", [id]);
  }
}
