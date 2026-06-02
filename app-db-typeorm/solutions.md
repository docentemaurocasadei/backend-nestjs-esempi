# Soluzioni: API NestJS con TypeORM

Questa soluzione mostra una possibile implementazione dell'esercizio. I nomi dei file fanno riferimento alla struttura gia presente nel progetto.

## Parte 1 - CRUD base

I CRUD sono gia implementati nei controller e nei service:

- `src/provinces/provinces.controller.ts`
- `src/provinces/provinces.service.ts`
- `src/locations/locations.controller.ts`
- `src/locations/locations.service.ts`

Le operazioni usano i repository TypeORM iniettati con `@InjectRepository`.

Esempio:

```ts
constructor(
  @InjectRepository(Province)
  private readonly provinceRepository: Repository<Province>,
) {}
```

## Parte 2 - Caricare la provincia nelle localita

Modifica `src/locations/locations.service.ts`.

```ts
findAll() {
  return this.locationRepository.find({
    relations: {
      province: true,
    },
  });
}

findOne(id: number) {
  return this.locationRepository.findOne({
    where: { id: Number(id) },
    relations: {
      province: true,
    },
  });
}
```

In questo modo TypeORM esegue il caricamento della relazione `Location -> Province` e aggiunge la proprieta `province` alla risposta JSON.

## Parte 3 - Caricare le localita nelle province

Modifica `src/provinces/provinces.service.ts`.

```ts
findAll() {
  return this.provinceRepository.find({
    relations: {
      locations: true,
    },
  });
}

findOne(id: number) {
  return this.provinceRepository.findOne({
    where: { id: Number(id) },
    relations: {
      locations: true,
    },
  });
}
```

La relazione funziona perche l'entita `Province` contiene:

```ts
@OneToMany(() => Location, location => location.province)
locations!: Location[];
```

e l'entita `Location` contiene:

```ts
@ManyToOne(() => Province, province => province.locations)
@JoinColumn({ name: 'province_id' })
province!: Province;
```

## Parte 4 - Validazione DTO

Aggiorna `src/provinces/dto/create-province.dto.ts`.

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProvinceDto {
  @ApiProperty({ description: 'The name of the province' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'The code of the province' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  code!: string;
}
```

Aggiorna `src/locations/dto/create-location.dto.ts`.

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ description: 'The name of the location' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'The province of the location' })
  @IsNotEmpty()
  @IsInt()
  province_id!: number;
}
```

I DTO di update possono restare basati su `PartialType`, perche rendono opzionali i campi del DTO di creazione.

Esempio atteso:

```ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProvinceDto } from './create-province.dto';

export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {}
```

## Parte 5 - Vincolo univoco sul codice provincia

Aggiorna `src/provinces/entities/province.entity.ts`.

```ts
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Location } from 'src/locations/entities/location.entity';

@Entity('provinces')
@Unique(['code'])
export class Province {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  code!: string;

  @OneToMany(() => Location, location => location.province)
  locations!: Location[];
}
```

Poi genera ed esegui una migrazione:

```bash
npm run migration:generate
npm run migration:run
```

La migrazione generata conterra un indice o vincolo univoco sulla colonna `code` della tabella `provinces`.

Per controllare le differenze ancora non migrate:

```bash
npm run schema:log
```

Se provi a creare due province con lo stesso codice:

```json
{
  "name": "Ancona",
  "code": "AN"
}
```

```json
{
  "name": "Altra Ancona",
  "code": "AN"
}
```

la seconda insert deve fallire con errore del database per chiave duplicata.

## Parte 6 - Rotta `GET /provinces/:id/locations`

Aggiungi un metodo in `src/provinces/provinces.service.ts`.

```ts
findLocations(id: number) {
  return this.provinceRepository
    .createQueryBuilder('province')
    .leftJoinAndSelect('province.locations', 'location')
    .where('province.id = :id', { id })
    .getOne()
    .then(province => province?.locations ?? []);
}
```

In alternativa, senza query builder:

```ts
async findLocations(id: number) {
  const province = await this.provinceRepository.findOne({
    where: { id: Number(id) },
    relations: {
      locations: true,
    },
  });

  return province?.locations ?? [];
}
```

Aggiungi la rotta in `src/provinces/provinces.controller.ts`.

```ts
@Get(':id/locations')
findLocations(@Param('id') id: string) {
  return this.provincesService.findLocations(+id);
}
```

Posiziona questa rotta prima di `@Get(':id')`, cosi Nest non interpreta `locations` come parametro generico di `GET /provinces/:id`.

Esempio di controller:

```ts
@Get()
findAll() {
  return this.provincesService.findAll();
}

@Get(':id/locations')
findLocations(@Param('id') id: string) {
  return this.provincesService.findLocations(+id);
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.provincesService.findOne(+id);
}
```

## Verifica

Compila il progetto:

```bash
npm run build
```

Esegui i test:

```bash
npm run test
```

Poi prova manualmente:

```http
POST http://localhost:3000/provinces
Content-Type: application/json

{
  "name": "Ancona",
  "code": "AN"
}
```

```http
POST http://localhost:3000/locations
Content-Type: application/json

{
  "name": "Senigallia",
  "province_id": 1
}
```

```http
GET http://localhost:3000/locations
```

```http
GET http://localhost:3000/provinces
```

```http
GET http://localhost:3000/provinces/1/locations
```
