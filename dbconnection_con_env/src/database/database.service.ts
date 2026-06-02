import { Injectable } from '@nestjs/common';
import { createConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  async testConnection() {
    try {
      const connection = await createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      await connection.ping();
      await connection.end();

      return {
        success: true,
        message: 'Connessione al database riuscita',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Connessione al database fallita',
      };
    }
  }
}