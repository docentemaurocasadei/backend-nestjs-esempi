import { Injectable, NotFoundException } from '@nestjs/common';

export interface Post {
  id: number;
  title: string;
  content: string;
}

@Injectable()
export class PostsService {
  private posts: Post[] = [
    { id: 1, title: 'Primo post', content: 'Contenuto del primo post' },
    { id: 2, title: 'Secondo post', content: 'Contenuto del secondo post' },
  ];

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    const post = this.posts.find((p) => p.id === id);

    if (!post) {
      throw new NotFoundException('Post non trovato');
    }

    return post;
  }

  create(data: Omit<Post, 'id'>) {
    const newPost: Post = {
      id: Date.now(),
      ...data,
    };

    this.posts.push(newPost);

    return newPost;
  }

  update(id: number, data: Partial<Omit<Post, 'id'>>) {
    const post = this.findOne(id);

    Object.assign(post, data);

    return post;
  }

  remove(id: number) {
    const post = this.findOne(id);

    this.posts = this.posts.filter((p) => p.id !== post.id);

    return {
      deleted: true,
      post,
    };
  }
}