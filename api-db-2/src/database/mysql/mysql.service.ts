import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MysqlService {
    private readonly pool: mysql.Pool;
    constructor(
        private readonly configService:ConfigService
    ) {
        
        this.pool = mysql.createPool({
            host: this.configService.get<string>('DB_HOST'),
            user: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PWD'),
            database: this.configService.get<string>('DB_NAME'),
            port: this.configService.get<number>('DB_PORT'),
        });
    }
    async query(sql: string, params?: any[]) {
        console.log(sql, params);
        const [rows, fields] = await this.pool.query(sql, params);
        return rows;
    }
    async close() {
        await this.pool.end();
    }
    async beginTransaction() {
        return this.pool.getConnection();
    }
}
