# Soluzione: API Leads con NestJS e MySQL

## Panoramica

Il progetto finale e' una API NestJS che espone un CRUD per la risorsa `leads`.

La struttura principale e':

```text
src/
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
  db/
    db.service.ts
  leads/
    leads.controller.ts
    leads.module.ts
    leads.service.ts
    dto/
      create-lead.dto.ts
      update-lead.dto.ts
    entities/
      lead.entity.ts
```

## Dipendenze

Le dipendenze principali usate dal progetto sono:

```bash
npm install mysql2 class-validator class-transformer @nestjs/swagger swagger-ui-express
```

## Database

Creare database e tabella:

```sql
CREATE DATABASE IF NOT EXISTS corso_app_db;

USE corso_app_db;

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  gender VARCHAR(30) NULL
);
```

## File `.env`

Configurazione usata dall'applicazione:

```env
APP_NAME=Guard Roles App
APP_ENV=development
APP_PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=corso_app_db
```

## Bootstrap applicazione

File: `src/main.ts`

Responsabilita:

- carica le variabili d'ambiente
- configura Swagger
- abilita la validazione globale
- abilita CORS
- avvia il server sulla porta `APP_PORT`

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Leads API')
    .setDescription('API per gestione leads')
    .setVersion('1.0')
    .addTag('leads')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: 'http://localhost:' + (process.env.FRONTEND_PORT ?? 3000),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}

bootstrap();
```

## Modulo principale

File: `src/app.module.ts`

Il modulo principale importa `LeadsModule` e registra i provider base.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { DbService } from './db/db.service';

@Module({
  imports: [LeadsModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
```

## Servizio database

File: `src/db/db.service.ts`

`DbService` centralizza la connessione MySQL e fornisce due metodi:

- `query`: per query di lettura
- `execute`: per istruzioni parametrizzate di scrittura o modifica

```ts
import { Injectable } from '@nestjs/common';
import { Connection, createConnection } from 'mysql2/promise';

@Injectable()
export class DbService {
  private conn!: Promise<Connection>;

  constructor() {
    this.conn = this.connect();
  }

  private async connect() {
    try {
      if (!this.conn) {
        this.conn = createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
      }
      return this.conn;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  }

  private async getConnection() {
    if (!this.conn) {
      this.conn = this.connect();
    }
    return this.conn;
  }

  public async query(sql: string, params?: any[]) {
    const connection = await this.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  }

  public async execute(sql: string, params?: any[]) {
    const connection = await this.getConnection();
    const [result] = await connection.execute(sql, params);
    return result;
  }
}
```

Nota: le query usano placeholder `?` e array di parametri. Questo evita di interpolare direttamente input utente dentro SQL.

## DTO

File: `src/leads/dto/create-lead.dto.ts`

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @ApiProperty()
  name!: string;

  @IsString()
  @ApiProperty()
  surname!: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  gender?: string;
}
```

File: `src/leads/dto/update-lead.dto.ts`

```ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}
```

`PartialType` rende opzionali tutti i campi del DTO di creazione, quindi `PATCH /leads/:id` puo ricevere solo i campi da modificare.

## Modulo leads

File: `src/leads/leads.module.ts`

```ts
import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { DbService } from 'src/db/db.service';

@Module({
  imports: [],
  controllers: [LeadsController],
  providers: [LeadsService, DbService],
})
export class LeadsModule {}
```

## Service leads

File: `src/leads/leads.service.ts`

```ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class LeadsService {
  constructor(private readonly dbService: DbService) {}

  create(createLeadDto: CreateLeadDto) {
    return this.dbService.execute(
      'INSERT INTO leads (name, surname, gender) VALUES (?, ?, ?)',
      [createLeadDto.name, createLeadDto.surname, createLeadDto.gender],
    );
  }

  findAll() {
    return this.dbService.query('SELECT * FROM leads');
  }

  findOne(id: number) {
    return this.dbService.query('SELECT * FROM leads WHERE id = ?', [id]);
  }

  async update(id: number, dto: UpdateLeadDto) {
    const fields: string[] = [];
    const values: any[] = [];

    for (const key in dto) {
      if (dto[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(dto[key]);
      }
    }

    if (fields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`;
    await this.dbService.execute(sql, values);

    return this.findOne(id);
  }

  remove(id: number) {
    return this.dbService.execute('DELETE FROM leads WHERE id = ?', [id]);
  }
}
```

Dettagli importanti:

- `create` inserisce un record nella tabella `leads`
- `findAll` legge tutti i lead
- `findOne` filtra per `id`
- `update` costruisce dinamicamente la `SET clause` usando solo i campi ricevuti
- `remove` elimina il record indicato

## Controller leads

File: `src/leads/leads.controller.ts`

```ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(+id, updateLeadDto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.leadsService.remove(+id);
  }
}
```

## Endpoint disponibili

| Metodo | URL | Body | Risultato |
| --- | --- | --- | --- |
| `GET` | `/` | nessuno | `Hello World!` |
| `POST` | `/leads` | `CreateLeadDto` | inserisce un lead |
| `GET` | `/leads` | nessuno | lista lead |
| `GET` | `/leads/:id` | nessuno | lead con id richiesto |
| `PATCH` | `/leads/:id` | `UpdateLeadDto` | aggiorna il lead |
| `DELETE` | `/leads/:id` | nessuno | elimina il lead |
| `GET` | `/api` | nessuno | Swagger UI |

## Test manuale con curl

Creazione:

```bash
curl -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Mario\",\"surname\":\"Rossi\",\"gender\":\"M\"}"
```

Lista:

```bash
curl http://localhost:3000/leads
```

Dettaglio:

```bash
curl http://localhost:3000/leads/1
```

Aggiornamento:

```bash
curl -X PATCH http://localhost:3000/leads/1 \
  -H "Content-Type: application/json" \
  -d "{\"surname\":\"Bianchi\"}"
```

Eliminazione:

```bash
curl -X DELETE http://localhost:3000/leads/1
```

## Comandi di verifica

Compilazione:

```bash
npm run build
```

Avvio in sviluppo:

```bash
npm run start:dev
```

Test e2e di base:

```bash
npm run test:e2e
```

## Possibili miglioramenti

- Restituire `404 Not Found` quando un lead non esiste.
- Usare `ParseIntPipe` su `@Param('id')` invece della conversione manuale con `+id`.
- Spostare `DbService` in un modulo dedicato `DbModule`.
- Usare un connection pool invece di una singola connessione.
- Aggiungere migrazioni SQL versionate.
- Aggiungere test e2e per tutti gli endpoint `/leads`.

