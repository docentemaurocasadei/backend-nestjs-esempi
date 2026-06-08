import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  create(createProvinceDto: CreateProvinceDto) {
    return this.provinceRepository.save(createProvinceDto);
  }

  findAll() {
    return this.provinceRepository.find();
  }

  findOne(id: number) {
    return this.provinceRepository.findOneBy({ id });
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return this.provinceRepository.update(id, updateProvinceDto);
  }

  remove(id: number) {
    return this.provinceRepository.delete(id);
  }
}
