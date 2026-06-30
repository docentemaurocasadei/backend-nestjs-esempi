import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, createConnection } from 'mysql2/promise';
import { connect } from 'rxjs/internal/operators/connect';
@Injectable()
export class DatabaseService {
    private connection!: Connection;

    constructor(private configService: ConfigService) {
    }
    async onModuleInit() {
        await this.connect();
    }
    async connect() {
        this.connection = await createConnection({
            host: this.configService.get<string>('DB_HOST'),
            user: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
        });
    }

    getConnection(): Connection {
        return this.connection;
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.end();
        }
    }
    async query(sql: string, params?: any[]): Promise<any> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }
        const [results] = await this.connection.execute(sql, params);
        return results;
    }
}
