import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  private async createConnection() {
    return createConnection({
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<string>('DB_PORT')),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    });
  }

  async testConnection() {
    let connection;

    try {
      connection = await this.createConnection();

      await connection.ping();

      return {
        success: true,
        message: 'Connessione al database riuscita',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Connessione al database fallita',
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  async getProducts() {
    let connection;

    try {
      connection = await this.createConnection();

      const [rows] = await connection.execute('SELECT * FROM products');

      return rows;
    } catch (error) {
      return {
        success: false,
        message: 'Errore durante il recupero dei prodotti',
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }
}