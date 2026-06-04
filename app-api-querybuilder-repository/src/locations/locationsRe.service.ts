import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { SearchLocationDto } from './dto/search-location';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsReService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}
  create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.save(createLocationDto);
  }

  findAll() {
    return this.locationRepository.find();
  }

  findOne(id: number) {
    return this.locationRepository.findOneBy({ id });
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return this.locationRepository.update(id, updateLocationDto);
  }

  remove(id: number) {
    return this.locationRepository.delete(id);
  }
  async search(searchLocationDto: SearchLocationDto) {
    if (!searchLocationDto) {
      return `This action searches all locations`;
    }
    if (searchLocationDto.name) {
      const result = await this.locationRepository.find({
        where: { name: searchLocationDto.name },
      });
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for name: ${searchLocationDto.name}`);
      }
      return result;
    }
    if (searchLocationDto.ids) {
      const result = await this.locationRepository.find({
        where: { id: In(searchLocationDto.ids) },
      });
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for ids: ${searchLocationDto.ids}`);
      }
      return result;
    }
    if (searchLocationDto.province_name) {
      const result = await this.locationRepository.find({
        where: {
          province: { name: Like(`%${searchLocationDto.province_name}%`) },
        },
        relations: { province: true },
      });
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for province name: ${searchLocationDto.province_name}`);
      }
      return result;
    }
    if (searchLocationDto.location_like) {
      const result = await this.locationRepository.find({
        where: { name: Like(`%${searchLocationDto.location_like}%`) },
      });
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for location like: ${searchLocationDto.location_like}`);
      }
      return result;
    }
    if (searchLocationDto.province_id) {
      const result = await this.locationRepository.find({
        where: { province_id: searchLocationDto.province_id },
      });
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for province id: ${searchLocationDto.province_id}`);
      } 
      return result;
    }
    return `This action searches locations with criteria: ${JSON.stringify(searchLocationDto)}`;
  }
}
