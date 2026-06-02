# Esercizio: API Leads con NestJS e MySQL

## Obiettivo

Realizzare una API REST con NestJS per gestire una lista di lead salvati in un database MySQL.

Il progetto deve esporre endpoint CRUD, usare DTO validati, leggere la configurazione dal file `.env` e documentare le rotte con Swagger.

## Stack richiesto

- Node.js
- NestJS
- TypeScript
- MySQL
- `mysql2/promise` per la connessione al database
- `class-validator` e `class-transformer` per la validazione dei DTO
- `@nestjs/swagger` per la documentazione automatica

## Modello dati

Creare un database MySQL chiamato `corso_app_db` e una tabella `leads`.

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

Campi richiesti:

- `id`: identificativo numerico autoincrementale
- `name`: nome del lead, obbligatorio
- `surname`: cognome del lead, obbligatorio
- `gender`: genere, opzionale

## Configurazione

Creare un file `.env` con le seguenti variabili:

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

L'applicazione deve ascoltare sulla porta indicata da `APP_PORT`, oppure su `3000` se la variabile non e' presente.

## Funzionalita richieste

### 1. Modulo database

Creare un servizio `DbService` responsabile della connessione a MySQL.

Il servizio deve:

- leggere host, utente, password e nome database da `.env`
- creare una connessione con `mysql2/promise`
- esporre un metodo `query(sql, params?)`
- esporre un metodo `execute(sql, params?)`
- usare parametri preparati per evitare SQL injection

### 2. Modulo leads

Creare un modulo `LeadsModule` composto da:

- `LeadsController`
- `LeadsService`
- DTO per creazione e aggiornamento

### 3. DTO

Creare `CreateLeadDto` con:

- `name`: stringa obbligatoria
- `surname`: stringa obbligatoria
- `gender`: stringa opzionale

Creare `UpdateLeadDto` partendo da `CreateLeadDto`, rendendo tutti i campi opzionali.

### 4. Endpoint REST

Implementare i seguenti endpoint:

| Metodo | Rotta | Descrizione |
| --- | --- | --- |
| `POST` | `/leads` | Crea un nuovo lead |
| `GET` | `/leads` | Restituisce tutti i lead |
| `GET` | `/leads/:id` | Restituisce un lead per id |
| `PATCH` | `/leads/:id` | Aggiorna parzialmente un lead |
| `DELETE` | `/leads/:id` | Elimina un lead |

### 5. Validazione globale

Configurare una `ValidationPipe` globale in `main.ts` con:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

L'API deve rifiutare proprieta non previste nei DTO.

### 6. Swagger

Configurare Swagger in `main.ts`.

La documentazione deve essere disponibile su:

```text
http://localhost:3000/api
```

La documentazione deve avere:

- titolo: `Leads API`
- descrizione: `API per gestione leads`
- versione: `1.0`
- tag: `leads`

### 7. CORS

Abilitare CORS per un frontend locale.

L'origine ammessa deve essere:

```text
http://localhost:<FRONTEND_PORT>
```

Se `FRONTEND_PORT` non e' presente, usare `3000`.

## Esempi di richieste

### Creazione lead

```http
POST /leads
Content-Type: application/json

{
  "name": "Mario",
  "surname": "Rossi",
  "gender": "M"
}
```

### Aggiornamento lead

```http
PATCH /leads/1
Content-Type: application/json

{
  "surname": "Bianchi"
}
```

### Risposte attese

`GET /leads` deve restituire una lista di record presenti nel database.

`GET /leads/:id` deve restituire il record con id corrispondente.

`PATCH /leads/:id` deve aggiornare solo i campi inviati.

`DELETE /leads/:id` deve eliminare il record indicato.

## Vincoli

- Non salvare i dati in memoria: usare MySQL.
- Non concatenare valori utente direttamente nelle query SQL.
- Non accettare campi extra nei body delle richieste.
- Il progetto deve avviarsi con `npm run start:dev`.
- Il progetto deve compilare con `npm run build`.

## Verifica finale

Prima della consegna verificare:

```bash
npm run build
npm run start:dev
```

Poi testare manualmente:

- `GET http://localhost:3000/`
- `GET http://localhost:3000/api`
- `POST http://localhost:3000/leads`
- `GET http://localhost:3000/leads`
- `PATCH http://localhost:3000/leads/1`
- `DELETE http://localhost:3000/leads/1`

