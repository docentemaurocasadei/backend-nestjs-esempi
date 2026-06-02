import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Product } from './entities/Product';
import { User } from './entities/User';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'jwt_products_demo',
  entities: [User, Product],
  // In un progetto didattico usiamo database.sql per rendere esplicito lo schema.
  synchronize: false,
  logging: false
});
