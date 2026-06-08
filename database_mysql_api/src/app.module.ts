import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { MysqlService } from './database/mysql/mysql.service';

@Module({
  imports: [PostsModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService, MysqlService],
})
export class AppModule {}
