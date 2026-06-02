import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Category } from '../categories/entities/category.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.postRepository.find({
      where: {
        active: true,
      },
      relations: {
        category: true,
      },
    });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post con id ${id} non trovato`);
    }

    return post;
  }

  async create(createPostDto: CreatePostDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: createPostDto.category_id,
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Category con id ${createPostDto.category_id} non trovata`,
      );
    }

    const post = this.postRepository.create({
      title: createPostDto.title,
      slug: createPostDto.slug,
      content: createPostDto.content,
      active: createPostDto.active ?? true,
      category,
    });

    return this.postRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    if (updatePostDto.category_id) {
      const category = await this.categoryRepository.findOne({
        where: {
          id: updatePostDto.category_id,
        },
      });

      if (!category) {
        throw new NotFoundException(
          `Category con id ${updatePostDto.category_id} non trovata`,
        );
      }

      post.category = category;
    }

    Object.assign(post, {
      title: updatePostDto.title ?? post.title,
      slug: updatePostDto.slug ?? post.slug,
      content: updatePostDto.content ?? post.content,
      active: updatePostDto.active ?? post.active,
    });

    return this.postRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    post.active = false;

    return this.postRepository.save(post);
  }
}