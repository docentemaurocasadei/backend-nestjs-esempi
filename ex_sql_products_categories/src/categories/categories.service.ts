import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    await this.databaseService.execute(
      'INSERT INTO categories (name, slug, description, is_active) VALUES (?, ?, ?, ?)',
      [
        createCategoryDto.name,
        createCategoryDto.slug,
        createCategoryDto.description || null,
        createCategoryDto.is_active || false,
      ],
    );
    const newCategoryId = await this.databaseService.query('SELECT LAST_INSERT_ID() AS id').then(result => result[0].id);
    return this.findOne(newCategoryId);
  }

  findAll() {
    return this.databaseService.query('SELECT * FROM categories');
  }

  findOne(id: number) {
    return this.databaseService.query('SELECT * FROM categories WHERE id = ?', [id]);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const fields:any = [];
    const values:any = [];

    if (updateCategoryDto.name !== undefined) {
      fields.push('name = ?');
      values.push(updateCategoryDto.name);
    }

    if (updateCategoryDto.slug !== undefined) {
      fields.push('slug = ?');
      values.push(updateCategoryDto.slug);
    }

    if (updateCategoryDto.description !== undefined) {
      fields.push('description = ?');
      values.push(updateCategoryDto.description);
    }

    if (updateCategoryDto.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(updateCategoryDto.is_active);
    }

    values.push(id);

    const sql = `
      UPDATE categories
      SET ${fields.join(', ')}
      WHERE id = ?
    `;
    return this.databaseService.execute(sql, values);
  }

  remove(id: number) {
    return this.databaseService.execute('DELETE FROM categories WHERE id = ?', [id]);
  }

  search(name: string): Promise<any> {
    return this.databaseService.query('SELECT * FROM categories WHERE name LIKE ?', [`%${name}%`]);
  }

  findProducts(categoryId: number): Promise<any> {
    return this.databaseService.query(
      `SELECT p.* FROM products p
       JOIN product_category pc ON p.id = pc.product_id
       WHERE pc.category_id = ?`,
      [categoryId],
    );
  }
}
