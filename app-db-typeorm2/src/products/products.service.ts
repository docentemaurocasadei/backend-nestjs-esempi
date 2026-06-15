import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import type { Logger } from 'winston';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) { }
  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto)
  }

  findAll() {
    this.logger.info('Find all products')

    return this.productRepository.find({ relations: { categories: true, images: true } })
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id }, relations: { categories: true, images: true } })
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto)
  }

  remove(id: number) {
    return this.productRepository.delete(id)
  }
}
