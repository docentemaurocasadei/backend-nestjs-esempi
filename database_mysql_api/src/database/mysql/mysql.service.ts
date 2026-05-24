import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';


@Injectable()
export class MysqlService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await this.pool.query(sql, params);
    return rows as T[];
  }
  async execute(
    sql: string,
    params: any[] = [],
  ): Promise<mysql.ResultSetHeader> {
    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      sql,
      params,
    );
    return result;
  }
}
