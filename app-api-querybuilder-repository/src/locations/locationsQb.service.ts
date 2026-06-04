import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { SearchLocationDto } from './dto/search-location';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class LocationsQbService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}
  create(createLocationDto: CreateLocationDto) {
    return this.locationRepository
      .createQueryBuilder('location')
      .insert()
      .into(Location)
      .values(createLocationDto)
      .execute();
  }

  findAll() {
    return this.locationRepository.createQueryBuilder('location').getMany();
  }

  findOne(id: number) {
    return this.locationRepository
      .createQueryBuilder('location')
      .where('location.id = :id', { id })
      .getOne();
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return this.locationRepository
      .createQueryBuilder('location')
      .update(Location)
      .set(updateLocationDto)
      .where('id = :id', { id })
      .execute();
  }

  remove(id: number) {
    return this.locationRepository
      .createQueryBuilder('location')
      .delete()
      .from(Location)
      .where('id = :id', { id })
      .execute();
  }
  async search(searchLocationDto: SearchLocationDto) {
    if (!searchLocationDto) {
      return `This action searches all locations`;
    }
    if (searchLocationDto.name) {
      const result = await this.locationRepository
        .createQueryBuilder('location')
        .where('location.name LIKE :name', {
          name: `%${searchLocationDto.name}%`,
        }).getMany();
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for name: ${searchLocationDto.name}`);
      }
      return result;
    }
    if (searchLocationDto.ids) {
      const result = await this.locationRepository
        .createQueryBuilder('location')
        .where('location.id IN (:...ids)', { ids: searchLocationDto.ids })
        .getMany();
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for ids: ${searchLocationDto.ids}`);
      }
      return result;
    }
    if (searchLocationDto.province_name) {
      const result = await this.locationRepository
        .createQueryBuilder('location')
        .innerJoinAndSelect('location.province', 'province')
        .where('province.name LIKE :province_name', {
          province_name: `%${searchLocationDto.province_name}%`,
        })
        .getMany();
        
        if (result.length === 0) {
          throw new NotFoundException(`No locations found for province name: ${searchLocationDto.province_name}`);
        }
        return result;
    }
    if (searchLocationDto.location_like) {
      const result = await this.locationRepository
        .createQueryBuilder('location')
        .where('location.name LIKE :location_like', {
          location_like: `%${searchLocationDto.location_like}%`,
        })
        .getMany();
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for location like: ${searchLocationDto.location_like}`);
      }
      return result;
    }
    if (searchLocationDto.province_id) {
      const result = await this.locationRepository
        .createQueryBuilder('location')
        .where('location.province_id = :province_id', { province_id: searchLocationDto.province_id })
        .getMany(); 
      if (result.length === 0) {
        throw new NotFoundException(`No locations found for province id: ${searchLocationDto.province_id}`);
      }
      return result;
    }

    return `This action searches locations with criteria: ${JSON.stringify(searchLocationDto)}`;
  }
}
