# Soluzione — Connessione a MySQL con ConfigModule

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
```

---

## `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import { DatabaseController } from './database/database.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController, DatabaseController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
```

**Punti chiave:**
- `ConfigModule.forRoot()` carica il file `.env` all'avvio dell'applicazione.
- `isGlobal: true` rende `ConfigService` disponibile ovunque senza reimportare `ConfigModule`.
- `DatabaseController` e `DatabaseService` vengono registrati nell'`AppModule`.

---

## `src/database/database.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  private async createConnection() {
    return createConnection({
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<string>('DB_PORT')),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    });
  }

  async testConnection() {
    let connection;

    try {
      connection = await this.createConnection();
      await connection.ping();

      return {
        success: true,
        message: 'Connessione al database riuscita',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Connessione al database fallita',
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  async getProducts() {
    let connection;

    try {
      connection = await this.createConnection();
      const [rows] = await connection.execute('SELECT * FROM products');

      return rows;
    } catch (error) {
      return {
        success: false,
        message: 'Errore durante il recupero dei prodotti',
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }
}
```

**Punti chiave:**
- `ConfigService` viene iniettato nel costruttore tramite dependency injection.
- `configService.get<string>('DB_HOST')` legge la variabile d'ambiente `DB_HOST` dal file `.env`.
- `DB_PORT` viene convertito in numero con `Number()` perché le variabili d'ambiente sono sempre stringhe.
- Il metodo privato `createConnection()` centralizza la logica di apertura connessione, evitando ripetizioni.
- Il blocco `finally` garantisce che la connessione venga chiusa anche in caso di errore.
- `connection.ping()` è usato per verificare che il server MySQL sia raggiungibile e risponda.
- `connection.execute()` restituisce una tupla `[rows, fields]`; con la destructuring `[rows]` si prende solo il risultato della query.

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

  @Get('products')
  async getProducts() {
    return this.databaseService.getProducts();
  }
}
```

**Punti chiave:**
- `@Controller('database')` definisce il prefisso `/database` per tutte le rotte del controller.
- `@Get('check-connection')` crea la rotta `GET /database/check-connection`.
- `@Get('products')` crea la rotta `GET /database/products`.
- Il controller non contiene logica: delega tutto al `DatabaseService`.

---

## Flusso complessivo

```
.env
  └─> ConfigModule (caricato in AppModule)
        └─> ConfigService (iniettato in DatabaseService)
              └─> DatabaseService (legge credenziali e gestisce la connessione)
                    └─> DatabaseController (espone le rotte HTTP)
```

---

## Rotte disponibili

| Metodo | URL                                  | Risposta attesa (successo)                        |
|--------|--------------------------------------|---------------------------------------------------|
| GET    | `http://localhost:3000/database/check-connection` | `{ "success": true, "message": "Connessione al database riuscita" }` |
| GET    | `http://localhost:3000/database/products`         | Array di oggetti prodotto dalla tabella `products` |
