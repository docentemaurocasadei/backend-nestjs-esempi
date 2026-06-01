import { Injectable } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { json } from 'stream/consumers';

export interface Animal {
  id: number;
  name: string;
  species: string;
}
@Injectable()
export class AnimalsService {
  private animals: Animal[] = [];
  create(createAnimalDto: CreateAnimalDto) {
    const newAnimal: Animal = {
      id: this.animals.length + 1,
      name: createAnimalDto.name,
      species: createAnimalDto.species,
    };
    this.animals.push(newAnimal);
    return newAnimal;
  }

  findAll(): Animal[] {
    return this.animals;
  }

  findOne(id: number): Animal | undefined {
    return this.animals.find(animal => animal.id === id);
  }

  update(id: number, updateAnimalDto: UpdateAnimalDto) {
    const animal = this.findOne(id);
    if (!animal) {
      return null;
    }
    Object.assign(animal, updateAnimalDto);
    return animal;
  }

  remove(id: number) {
    const index = this.animals.findIndex(animal => animal.id === id);
    if (index === -1) {
      return null;
    }
    const removedAnimal = this.animals.splice(index, 1)[0];
    return removedAnimal;   
  }
}
