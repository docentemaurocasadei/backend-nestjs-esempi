import { Injectable } from '@nestjs/common';
import { Connection, createConnection } from 'mysql2/promise';

@Injectable()
export class DbService {
    private conn!: Promise<Connection>;
    constructor() {
        this.conn = this.connect();
    }

    private async connect() {
        try {
            if (!this.conn) {
                this.conn = createConnection(
                    {
                        host: process.env.DB_HOST,
                        user: process.env.DB_USER,
                        password: process.env.DB_PASSWORD,
                        database: process.env.DB_NAME,
                    }
                );
            }
            return this.conn;
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
    }

    private async getConnection() {
        if (!this.conn) {
            this.conn = this.connect();
        }
        return this.conn;
    }

    public async query(sql: string, params?: any[]) {
        const connection = await this.getConnection();
        const [results] = await connection.execute(sql, params);
        return results;
    }

    public async execute(sql: string, params?: any[]) {
        const connection = await this.getConnection();
        const [result] = await connection.execute(sql, params);
        return result;
    }

}