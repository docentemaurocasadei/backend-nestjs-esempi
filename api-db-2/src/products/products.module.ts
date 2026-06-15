import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MysqlService } from 'src/database/mysql/mysql.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, MysqlService],
})
export class ProductsModule { }
