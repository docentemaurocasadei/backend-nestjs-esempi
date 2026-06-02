# Soluzioni — app_base1

---

## Parte 1 — Campo `age` negli animali

### `src/animals/dto/create-animal.dto.ts`

```ts
import { IsString, IsInt, Min } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  name!: string;

  @IsString()
  species!: string;

  @IsInt()
  @Min(0)
  age!: number;
}
```

### `src/animals/animals.service.ts`

Aggiorna l'interfaccia e il metodo `create`:

```ts
import { Injectable } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

export interface Animal {
  id: number;
  name: string;
  species: string;
  age: number;          // ← aggiunto
}

@Injectable()
export class AnimalsService {
  private animals: Animal[] = [];

  create(createAnimalDto: CreateAnimalDto) {
    const newAnimal: Animal = {
      id: this.animals.length + 1,
      name: createAnimalDto.name,
      species: createAnimalDto.species,
      age: createAnimalDto.age,          // ← aggiunto
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
    if (!animal) return null;
    Object.assign(animal, updateAnimalDto);
    return animal;
  }

  remove(id: number) {
    const index = this.animals.findIndex(animal => animal.id === id);
    if (index === -1) return null;
    return this.animals.splice(index, 1)[0];
  }
}
```

---

## Parte 2 — Gestione errori HTTP

### `src/animals/animals.controller.ts`

```ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  NotFoundException,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }

  @Get()
  findAll() {
    return this.animalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const animal = this.animalsService.findOne(+id);
    if (!animal) throw new NotFoundException();
    return animal;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    const animal = this.animalsService.update(+id, updateAnimalDto);
    if (!animal) throw new NotFoundException();
    return animal;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const animal = this.animalsService.remove(+id);
    if (!animal) throw new NotFoundException();
    return animal;
  }
}
```

---

## Parte 3 — Modulo `keepers`

### `src/keepers/dto/create-keeper.dto.ts`

```ts
import { IsString } from 'class-validator';

export class CreateKeeperDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  assignedSpecies!: string;
}
```

### `src/keepers/dto/update-keeper.dto.ts`

```ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateKeeperDto } from './create-keeper.dto';

export class UpdateKeeperDto extends PartialType(CreateKeeperDto) {}
```

### `src/keepers/keepers.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { CreateKeeperDto } from './dto/create-keeper.dto';
import { UpdateKeeperDto } from './dto/update-keeper.dto';

export interface Keeper {
  id: number;
  firstName: string;
  lastName: string;
  assignedSpecies: string;
}

@Injectable()
export class KeepersService {
  private keepers: Keeper[] = [];

  create(createKeeperDto: CreateKeeperDto): Keeper {
    const newKeeper: Keeper = {
      id: this.keepers.length + 1,
      ...createKeeperDto,
    };
    this.keepers.push(newKeeper);
    return newKeeper;
  }

  findAll(): Keeper[] {
    return this.keepers;
  }

  findOne(id: number): Keeper | undefined {
    return this.keepers.find(k => k.id === id);
  }

  update(id: number, updateKeeperDto: UpdateKeeperDto): Keeper | null {
    const keeper = this.findOne(id);
    if (!keeper) return null;
    Object.assign(keeper, updateKeeperDto);
    return keeper;
  }

  remove(id: number): Keeper | null {
    const index = this.keepers.findIndex(k => k.id === id);
    if (index === -1) return null;
    return this.keepers.splice(index, 1)[0];
  }
}
```

### `src/keepers/keepers.controller.ts`

```ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  NotFoundException,
} from '@nestjs/common';
import { KeepersService } from './keepers.service';
import { CreateKeeperDto } from './dto/create-keeper.dto';
import { UpdateKeeperDto } from './dto/update-keeper.dto';

@Controller('keepers')
export class KeepersController {
  constructor(private readonly keepersService: KeepersService) {}

  @Post()
  create(@Body() createKeeperDto: CreateKeeperDto) {
    return this.keepersService.create(createKeeperDto);
  }

  @Get()
  findAll() {
    return this.keepersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const keeper = this.keepersService.findOne(+id);
    if (!keeper) throw new NotFoundException();
    return keeper;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKeeperDto: UpdateKeeperDto) {
    const keeper = this.keepersService.update(+id, updateKeeperDto);
    if (!keeper) throw new NotFoundException();
    return keeper;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const keeper = this.keepersService.remove(+id);
    if (!keeper) throw new NotFoundException();
    return keeper;
  }
}
```

### `src/keepers/keepers.module.ts`

```ts
import { Module } from '@nestjs/common';
import { KeepersService } from './keepers.service';
import { KeepersController } from './keepers.controller';

@Module({
  controllers: [KeepersController],
  providers: [KeepersService],
})
export class KeepersModule {}
```

### `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalsModule } from './animals/animals.module';
import { KeepersModule } from './keepers/keepers.module';  // ← aggiunto
import { ZooMiddleware } from './zoo/zoo.middleware';

@Module({
  imports: [AnimalsModule, KeepersModule],                 // ← aggiunto
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: any) {
    consumer.apply(ZooMiddleware).forRoutes('*');
  }
}
```

---

## Note

- `UpdateAnimalDto` e `UpdateKeeperDto` usano `PartialType`: tutti i campi diventano opzionali
  automaticamente, non serve ridichiarare nulla.
- Il middleware `ZooMiddleware` usa `forRoutes('*')`, quindi protegge `/keepers` senza modifiche.
- Rimuovi l'import inutilizzato `import { json } from 'stream/consumers'` da `animals.service.ts`.
