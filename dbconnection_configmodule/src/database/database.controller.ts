import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) {}
    
    @Get('check-connection')
    async checkConnection() {
        return this.databaseService.testConnection();
    }

    @Get('products')
    async getProducts() {
        return this.databaseService.getProducts();
    }
}
