# Esercizio — Connessione a MySQL con dotenv e process.env

## Obiettivo

Creare un'applicazione NestJS che si connette a un database MySQL leggendo le credenziali direttamente dalle variabili d'ambiente tramite `dotenv` e `process.env`, senza usare `@nestjs/config`.

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
APP_PORT=3000
```

### 2. Caricamento di dotenv in `main.ts`

Carica `dotenv` **prima** di creare l'applicazione NestJS, in modo che le variabili d'ambiente siano disponibili fin dall'avvio. La porta dell'app deve essere letta da `process.env.APP_PORT`.

### 3. DatabaseService

Crea un service `DatabaseService` che esponga un metodo `testConnection()` il quale:

- apra una connessione MySQL usando i valori letti direttamente da `process.env`
- esegua un ping al database
- chiuda la connessione
- restituisca `{ success: true, message: '...' }` in caso di successo
- restituisca `{ success: false, message: '...' }` in caso di errore, gestito con un blocco `try/catch`

> Non usare `ConfigService` o `ConfigModule`: accedi alle variabili d'ambiente direttamente tramite `process.env`.

### 4. DatabaseController

Crea un controller `DatabaseController` con prefisso di rotta `/database` che esponga:

| Metodo | Rotta                        | Descrizione                                   |
|--------|------------------------------|-----------------------------------------------|
| GET    | `/database/check-connection` | Chiama `testConnection()` e restituisce il risultato |

---

## Tecnologie richieste

- **NestJS** (framework)
- **dotenv** (caricamento variabili d'ambiente)
- **mysql2** (driver MySQL, usare `mysql2/promise` per la versione asincrona)

## Installazione dipendenze

```bash
npm install dotenv mysql2
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
```

---

## Nota

Questo approccio è più diretto ma meno integrato con l'ecosistema NestJS rispetto all'uso di `@nestjs/config`. Il passo successivo naturale è sostituire `dotenv` + `process.env` con `ConfigModule` e `ConfigService`.
