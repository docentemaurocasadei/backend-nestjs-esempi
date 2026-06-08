import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

export interface Post {
  id: number;
  title: string;
  content: string;
}

@Injectable()
export class PostsService {
  private posts: Post[];
  constructor() {
    this.posts = [];
  }
  create(createPostDto: CreatePostDto): Post {
    const newPost: Post = {
      id: this.posts.length + 1,
      title: createPostDto.title,
      content: createPostDto.content
    };
    this.posts.push(newPost);
    return newPost;
  }

  findAll():Post[] {
    return this.posts;
  }

  findOne(id: number): Post | undefined {
    return this.posts.find(post => post.id === id);
  }

  update(id: number, updatePostDto: UpdatePostDto): Post | undefined {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return undefined;
    }
    this.posts[postIndex] = { ...this.posts[postIndex], ...updatePostDto };
    return this.posts[postIndex];
  }

  remove(id: number):boolean {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return false;
    }
    this.posts.splice(postIndex, 1);
    return true;
  }
}
