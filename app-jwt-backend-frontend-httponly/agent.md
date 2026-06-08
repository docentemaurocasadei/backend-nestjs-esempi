# Prompt per Codex

Realizza un progetto didattico completo con **Node.js**, **Express**, **TypeScript**, **TypeORM**, **MySQL**, **JWT in cookie HttpOnly** e frontend **HTML + JavaScript + Fetch API**.

## Obiettivo

Creare una piccola applicazione full stack composta da:

* Backend Node.js + Express
* Frontend HTML + JavaScript Vanilla
* Database MySQL
* TypeORM
* Autenticazione JWT
* Token salvato in cookie HttpOnly
* CRUD completo sulla rotta `/products`
* Nessuna gestione ruoli

---

## Stack richiesto

Usare:

* Node.js
* TypeScript
* Express
* TypeORM
* MySQL
* mysql2
* jsonwebtoken
* bcrypt
* dotenv
* cookie-parser
* HTML
* CSS
* JavaScript Vanilla
* Fetch API

---

## Funzionalità richieste

### Login pubblico

Implementare:

```http
POST /login
```

Body:

```json
{
  "username": "admin",
  "password": "password"
}
```

Se le credenziali sono corrette:

* genera JWT
* salva il token in cookie HttpOnly
* restituisce messaggio JSON

Esempio:

```ts
res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: 60 * 60 * 1000,
});
```

Risposta:

```json
{
  "message": "Login effettuato"
}
```

---

## Logout

Implementare:

```http
POST /logout
```

La rotta deve eliminare il cookie:

```ts
res.clearCookie('token');
```

Risposta:

```json
{
  "message": "Logout effettuato"
}
```

---

## JWT

Usare:

```env
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1h
COOKIE_NAME=token
COOKIE_MAX_AGE=3600000
```

---

## Middleware JWT

Creare:

```text
src/middleware/auth.middleware.ts
```

Il middleware deve:

* leggere il token dal cookie
* verificare il JWT
* bloccare richieste non autorizzate
* restituire `401 Unauthorized`

Esempio:

```ts
const token = req.cookies.token;
```

Non usare:

```http
Authorization: Bearer TOKEN
```

---

## Rotta protetta `/products`

Tutte le rotte `/products` devono essere protette dal middleware JWT.

Implementare CRUD completo:

```http
GET /products
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id
```

---

## Entity User

Campi:

```text
id
username
password
created_at
updated_at
```

La password deve essere salvata hashata con bcrypt.

---

## Entity Product

Campi:

```text
id
name
description
price
created_at
updated_at
```

---

## Utente iniziale

Creare un seed con utente:

```text
username: admin
password: password
```

---

## Database MySQL

Usare TypeORM con MySQL.

Installare:

```bash
npm install mysql2
```

---

## database.sql

Creare file:

```text
database.sql
```

Deve contenere:

* `CREATE DATABASE jwt_products_demo`
* tabella `users`
* tabella `products`
* indici utili
* tipi corretti per MySQL

---

## Seed

Creare:

```text
src/seed.ts
```

Lo script deve inserire:

* utente admin
* alcuni prodotti di esempio

Comando:

```bash
npm run seed
```

---

## Frontend

Creare:

```text
public/index.html
public/app.js
public/style.css
```

Il frontend deve permettere:

* login
* logout
* visualizzazione prodotti
* inserimento prodotto
* modifica prodotto
* eliminazione prodotto

---

## Fetch con cookie HttpOnly

Tutte le chiamate che devono inviare o ricevere cookie devono usare:

```js
credentials: 'include'
```

Esempio login:

```js
fetch('/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    username,
    password
  })
});
```

Esempio chiamata protetta:

```js
fetch('/products', {
  method: 'GET',
  credentials: 'include'
});
```

---

## Importante

Non usare:

```js
localStorage
sessionStorage
Authorization Bearer
```

Il token JWT deve essere gestito solo tramite cookie HttpOnly.

Il frontend non deve poter leggere direttamente il token.

---

## server.ts

Configurare:

```ts
import express from 'express';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
```

---

## .env.example

Creare:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=corso_jwt_products_demo

JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1h

COOKIE_NAME=token
COOKIE_MAX_AGE=3600000
```

---

## Struttura progetto richiesta

```text
project/
├── src/
│   ├── entities/
│   │   ├── User.ts
│   │   └── Product.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── product.routes.ts
│   ├── data-source.ts
│   ├── seed.ts
│   └── server.ts
│
├── public/
│   ├── index.html
│   ├── app.js
│   └── style.css
│
├── database.sql
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## package.json

Prevedere almeno:

```json
{
  "scripts": {
    "dev": "ts-node-dev src/server.ts",
    "start": "node dist/server.js",
    "build": "tsc",
    "seed": "ts-node src/seed.ts"
  }
}
```

---

## README.md

Il README deve spiegare chiaramente:

### Installazione

```bash
npm install
```

### Creazione database

```bash
mysql -u root -p < database.sql
```

### Configurazione ambiente

```bash
cp .env.example .env
```

### Seed

```bash
npm run seed
```

### Avvio progetto

```bash
npm run dev
```

### Apertura frontend

```text
http://localhost:3000
```

### Credenziali

```text
username: admin
password: password
```

---

## Istruzioni Git

Inserire nel README:

```bash
git init
git add .
git commit -m "Initial commit - JWT HttpOnly Cookie Products CRUD"
```

Repository remoto:

```bash
git remote add origin URL_DEL_REPOSITORY
git branch -M main
git push -u origin main
```

---

## Gestione errori

Gestire almeno:

* login errato
* token mancante
* token non valido
* prodotto non trovato
* errori database
* validazione base dei campi

Restituire status HTTP corretti:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
500 Internal Server Error
```

---

## Requisiti didattici

Il codice deve essere:

* semplice
* commentato
* organizzato
* leggibile
* adatto a studenti che stanno imparando JWT, cookie HttpOnly e CRUD

---

## Output richiesto

Genera tutti i file completi del progetto:

* `package.json`
* `tsconfig.json`
* `.env.example`
* `.gitignore`
* `database.sql`
* `src/entities/User.ts`
* `src/entities/Product.ts`
* `src/data-source.ts`
* `src/middleware/auth.middleware.ts`
* `src/routes/auth.routes.ts`
* `src/routes/product.routes.ts`
* `src/seed.ts`
* `src/server.ts`
* `public/index.html`
* `public/app.js`
* `public/style.css`
* `README.md`

Il progetto deve essere funzionante senza modifiche strutturali aggiuntive.
