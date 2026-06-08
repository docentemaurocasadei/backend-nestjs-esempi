import { Injectable } from '@nestjs/common';
import { createConnection, Connection} from 'mysql2/promise';

@Injectable()
export class DatabaseService {
    private connection!: Connection;
    constructor() {
        this.connect();
    }   

    async connect() {
        this.connection = await createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
    }

    getConnection(): Connection {
        return this.connection;
    }

    async query(sql: string, params?: any[]): Promise<any> {
        if (!this.connection) {
            await this.connect();
        }
        const [results] = await this.connection.execute(sql, params);
        return results;
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
        }
    }

    async execute(sql: string, params?: any[]): Promise<void> {
        if (!this.connection) {
            await this.connect();
        }
        await this.connection.execute(sql, params);
    }
}
