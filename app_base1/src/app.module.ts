import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalsModule } from './animals/animals.module';
import { ZooMiddleware } from './zoo/zoo.middleware';

@Module({
  imports: [AnimalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: any) {
    consumer.apply(ZooMiddleware).forRoutes('*');
  }
}
