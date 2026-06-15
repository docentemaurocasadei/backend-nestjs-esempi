import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';  
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';7
import { TolowerMiddleware } from './tolower/tolower.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true
      }
    ),
    ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: any) {
    consumer
      .apply(TolowerMiddleware)
      .forRoutes(ProductsController);
  }
}
