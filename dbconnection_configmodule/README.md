# Esercizio — Connessione a MySQL con ConfigModule

## Obiettivo

Creare un'applicazione NestJS che si connette a un database MySQL leggendo le credenziali da un file `.env` tramite il modulo `@nestjs/config`.

---

## Requisiti

### 1. Configurazione dell'ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tuapassword
DB_NAME=nomedb
```

### 2. ConfigModule globale

Configura `ConfigModule` nell'`AppModule` in modo che:

- carichi automaticamente il file `.env`
- sia disponibile globalmente in tutta l'applicazione (senza doverlo reimportare in ogni modulo)

### 3. DatabaseService

Crea un service `DatabaseService` che:

- riceva `ConfigService` tramite dependency injection
- esponga un metodo `testConnection()` che:
  - apra una connessione MySQL usando le variabili lette da `ConfigService`
  - esegua un ping al database
  - restituisca `{ success: true, message: '...' }` in caso di successo
  - restituisca `{ success: false, message: '...' }` in caso di errore
  - chiuda sempre la connessione nel blocco `finally`
- esponga un metodo `getProducts()` che:
  - esegua la query `SELECT * FROM products`
  - restituisca le righe risultanti
  - gestisca gli errori restituendo `{ success: false, message: '...' }`
  - chiuda sempre la connessione nel blocco `finally`

### 4. DatabaseController

Crea un controller `DatabaseController` con prefisso di rotta `/database` che esponga:

| Metodo | Rotta                       | Descrizione                        |
|--------|-----------------------------|------------------------------------|
| GET    | `/database/check-connection`| Chiama `testConnection()` e restituisce il risultato |
| GET    | `/database/products`        | Chiama `getProducts()` e restituisce i prodotti |

---

## Tecnologie richieste

- **NestJS** (framework)
- **@nestjs/config** (gestione variabili d'ambiente)
- **mysql2** (driver MySQL, usare `mysql2/promise` per la versione asincrona)

## Installazione dipendenze

```bash
npm install @nestjs/config mysql2
```

---

## Struttura attesa del progetto

```
src/
├── app.module.ts
├── main.ts
└── database/
    ├── database.controller.ts
    └── database.service.ts
```

---

## Test

Avvia l'applicazione con `npm run start:dev` e verifica:

```
GET http://localhost:3000/database/check-connection
GET http://localhost:3000/database/products
```
