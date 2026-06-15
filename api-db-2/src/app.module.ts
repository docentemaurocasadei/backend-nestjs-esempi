import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TolowerMiddleware } from './tolower/tolower.middleware';
import { ProductsController } from './products/products.controller';
import { MyloggerMiddleware } from './mylogger/mylogger.middleware';
import { WinstonModule } from 'nest-winston';
import { MysqlService } from './database/mysql/mysql.service';
import * as winstonLogger from 'winston';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ProductsModule, WinstonModule.forRoot({
    level: 'info',
    format: winstonLogger.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winstonLogger.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winstonLogger.transports.File({ filename: 'logs/combined.log' }),
    ],
  }),
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    //serveo i file statici in /public ma escludo /public/api in modo che il router possa intercettare le chiamate api
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api/{*path}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MysqlService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TolowerMiddleware, MyloggerMiddleware).forRoutes("/*");
  }
}
