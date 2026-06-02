import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MysqlService } from 'src/database/mysql/mysql.service';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, MysqlService],
})
export class PostsModule {}
