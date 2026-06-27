import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql, { Connection, RowDataPacket } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  private async connect(): Promise<Connection> {
    return mysql.createConnection({
      host: this.configService.getOrThrow<string>('DB_HOST'),
      port: Number(this.configService.getOrThrow<string>('DB_PORT')),
      user: this.configService.getOrThrow<string>('DB_USER'),
      password: this.configService.getOrThrow<string>('DB_PASSWORD'),
      database: this.configService.getOrThrow<string>('DB_NAME'),
    });
  }

  public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const connection = await this.connect();

    try {
      const [rows] = await connection.execute<RowDataPacket[]>(sql, params);
      return rows as T[];
    } finally {
      await connection.end();
    }
  }
}