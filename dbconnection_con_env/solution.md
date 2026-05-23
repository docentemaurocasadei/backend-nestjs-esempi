# Soluzione — Connessione a MySQL con dotenv e process.env

## Struttura dei file

```
src/
├── app.module.ts
├── main.ts
└── database/
    ├── database.controller.ts
    └── database.service.ts
```

---

## File `.env`

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tuapassword
DB_NAME=nomedb
APP_PORT=3000
```

---

## `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
```

**Punti chiave:**
- `dotenv.config()` va chiamato **prima** di `NestFactory.create()`: carica il file `.env` e popola `process.env` prima che qualsiasi modulo NestJS venga istanziato.
- `process.env.APP_PORT ?? 3000` usa l'operatore nullish coalescing: se `APP_PORT` non è definita nel `.env`, l'app ascolta sulla porta 3000.

---

## `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { DatabaseController } from './database/database.controller';

@Module({
  imports: [],
  controllers: [AppController, DatabaseController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
```

**Punti chiave:**
- Non è necessario importare `ConfigModule`: le variabili d'ambiente sono già state caricate da `dotenv` in `main.ts` e sono accessibili globalmente tramite `process.env`.
- `DatabaseController` e `DatabaseService` vengono registrati nell'`AppModule`.

---

## `src/database/database.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { createConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  async testConnection() {
    try {
      const connection = await createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      await connection.ping();
      await connection.end();

      return {
        success: true,
        message: 'Connessione al database riuscita',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Connessione al database fallita',
      };
    }
  }
}
```

**Punti chiave:**
- Le credenziali vengono lette direttamente da `process.env`, senza dependency injection.
- `DB_PORT` viene convertito in numero con `Number()` perché le variabili d'ambiente sono sempre stringhe.
- La connessione viene chiusa con `connection.end()` subito dopo il ping, all'interno del blocco `try`.
- Il blocco `catch` restituisce una risposta strutturata invece di rilanciare l'eccezione, rendendo la risposta HTTP sempre con status 200.

---

## `src/database/database.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('check-connection')
  async checkConnection() {
    return this.databaseService.testConnection();
  }
}
```

**Punti chiave:**
- `@Controller('database')` definisce il prefisso `/database` per tutte le rotte del controller.
- `@Get('check-connection')` crea la rotta `GET /database/check-connection`.
- Il controller delega interamente la logica al `DatabaseService`.

---

## Flusso complessivo

```
.env
  └─> dotenv.config() in main.ts (popola process.env)
        └─> process.env.DB_* letti direttamente in DatabaseService
              └─> DatabaseService (gestisce la connessione MySQL)
                    └─> DatabaseController (espone la rotta HTTP)
```

---

## Rotte disponibili

| Metodo | URL                                              | Risposta attesa (successo)                                          |
|--------|--------------------------------------------------|---------------------------------------------------------------------|
| GET    | `http://localhost:3000/database/check-connection`| `{ "success": true, "message": "Connessione al database riuscita" }` |

---

## Confronto con l'approccio ConfigModule

| Aspetto              | `dotenv` + `process.env`          | `@nestjs/config` + `ConfigService`      |
|----------------------|-----------------------------------|-----------------------------------------|
| Dipendenze           | `dotenv`, `mysql2`                | `@nestjs/config`, `mysql2`              |
| Caricamento `.env`   | `dotenv.config()` in `main.ts`    | `ConfigModule.forRoot()` in `AppModule` |
| Lettura variabili    | `process.env.NOME`                | `configService.get<string>('NOME')`     |
| Integrazione NestJS  | Minimale                          | Nativa, con DI e tipizzazione           |
| Testabilità          | Più difficile da mockare          | Facile da mockare tramite DI            |
