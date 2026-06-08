import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { Post as PostEntity } from './posts.service';
import { Throttle } from '@nestjs/throttler';

@Controller('posts')
@Throttle({ default: { limit: 3, ttl: 60000 } })
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto): PostEntity {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(): PostEntity[] {
    return this.postsService.findAll();
  }

  @Get('search')
  search(@Query('query') query: string): PostEntity[] {
    query = query.toLowerCase();
    console.log(`Searching for posts with query: ${query}`);
    const allPosts = this.postsService.findAll();
    return allPosts.filter(post => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): PostEntity | undefined {
    return this.postsService.findOne(+id);
  }

  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): PostEntity | undefined {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): boolean {
    return this.postsService.remove(+id);
  }
  
}
