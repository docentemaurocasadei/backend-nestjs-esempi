import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';

@Module({
    imports: [],
    providers: [],
    controllers: [ProductsController],
    exports: []

})
export class ProductsModule {
}
