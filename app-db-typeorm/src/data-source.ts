import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Province } from './provinces/entities/province.entity';
import { Location } from './locations/entities/location.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Province, Location],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});