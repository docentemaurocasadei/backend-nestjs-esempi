import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MysqlService } from '../database/mysql/mysql.service';

@Injectable()
export class PostsService {
  constructor(private readonly mysqlService: MysqlService) {}

  async create(createPostDto: CreatePostDto) {
    const result = await this.mysqlService.execute(
      `
      INSERT INTO posts (title, slug, content, active, category_id)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        createPostDto.title,
        createPostDto.slug,
        createPostDto.content,
        createPostDto.active,
        createPostDto.category_id,
      ],
    );
    return { id: result.insertId, ...createPostDto };
  }

  async findAll() {
    return this.mysqlService.query(
      `
      SELECT 
        posts.id,
        posts.title,
      posts.slug,
      posts.content,
      posts.active,
      posts.created_at,
      categories.name AS category_name
    FROM posts
    LEFT JOIN categories 
      ON categories.id = posts.category_id
    WHERE posts.active = ?
  `,
      [true],
    );
  }

  async findOne(id: number) {
    const posts = await this.mysqlService.query(
      `
      SELECT
        posts.id,
        posts.title,
        posts.slug,
        posts.content,
        posts.active,
        posts.created_at,
        categories.name AS category_name
      FROM posts
      LEFT JOIN categories 
        ON categories.id = posts.category_id
      WHERE posts.id = ? AND posts.active = ?
    `,
      [id, true],
    );
    return posts[0];
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const result = await this.mysqlService.execute(
      `
      UPDATE posts
      SET title = ?, slug = ?, content = ?, active = ?, category_id = ?
      WHERE id = ?
    `,
      [
        updatePostDto.title,
        updatePostDto.slug,
        updatePostDto.content,
        updatePostDto.active,
        updatePostDto.category_id,
        id,
      ],
    );
    return result.affectedRows > 0;
  }

  async remove(id: number) {
    const result = await this.mysqlService.execute(
      `
      DELETE FROM posts
      WHERE id = ?
    `,
      [id],
    );
    return result.affectedRows > 0;
  }
}
