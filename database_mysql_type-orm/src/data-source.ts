import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Post } from './posts/entities/post.entity';
import { Category } from './categories/entities/category.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Post, Category],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});