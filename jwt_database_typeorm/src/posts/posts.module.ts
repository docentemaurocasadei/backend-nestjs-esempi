import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Category } from 'src/categories/entities/category.entity';
import { Post } from './entities/post.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category])
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
