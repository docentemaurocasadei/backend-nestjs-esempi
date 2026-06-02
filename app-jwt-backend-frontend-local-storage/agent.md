# Prompt per Codex

Realizza un progetto didattico completo con **Node.js**, **Express**, **TypeScript**, **TypeORM**, **MySQL**, **JWT** e un frontend **HTML + JavaScript + Fetch API**.

L'obiettivo è creare un esempio semplice ma professionale che mostri autenticazione JWT, CRUD completo e comunicazione frontend-backend.

---

# Requisiti generali

Realizzare un'applicazione composta da:

* Backend Node.js + Express
* Frontend HTML + JavaScript Vanilla
* Database MySQL
* TypeORM
* JWT Authentication
* Nessuna gestione ruoli
* Nessun framework frontend
* Codice commentato e didattico

---

# Stack tecnologico

Utilizzare:

* Node.js
* TypeScript
* Express
* TypeORM
* MySQL
* mysql2
* JWT (jsonwebtoken)
* bcrypt
* dotenv
* HTML
* CSS
* JavaScript Vanilla
* Fetch API

---

# Funzionalità richieste

## Login

Implementare una rotta pubblica:

```http
POST /login
```

Richiesta:

```json
{
  "username": "admin",
  "password": "password"
}
```

Risposta:

```json
{
  "access_token": "JWT_TOKEN"
}
```

La password deve essere verificata tramite bcrypt.

---

# JWT

Generare JWT firmati tramite:

```env
JWT_SECRET=super_secret_key
```

Durata token:

```env
JWT_EXPIRES_IN=1h
```

---

# Salvataggio token

Dopo il login il frontend deve:

```javascript
localStorage.setItem('token', data.access_token);
```

Utilizzare il token per tutte le chiamate protette.

Esempio:

```javascript
const token = localStorage.getItem('token');

fetch('/products', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

IMPORTANTE:

Non usare cookie.

Utilizzare esclusivamente:

```text
localStorage
```

---

# CRUD Prodotti

Creare una sola risorsa protetta:

```http
/products
```

Tutte le rotte devono richiedere JWT valido.

Implementare:

```http
GET /products
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id
```

---

# Entity Product

Campi richiesti:

```text
id
name
description
price
created_at
updated_at
```

---

# Entity User

Campi richiesti:

```text
id
username
password
created_at
updated_at
```

---

# Utente iniziale

Creare automaticamente un utente:

```text
username: admin
password: password
```

La password deve essere salvata con hash bcrypt.

---

# Database MySQL

Utilizzare MySQL tramite TypeORM.

Installare:

```bash
npm install mysql2
```

Configurazione tramite variabili ambiente.

---

# File SQL richiesto

Creare:

```text
database.sql
```

contenente:

* CREATE DATABASE
* CREATE TABLE users
* CREATE TABLE products
* indici necessari

Esempio database:

```sql
jwt_products_demo
```

---

# Seed Database

Creare uno script:

```bash
npm run seed
```

che inserisca:

* utente admin
* alcuni prodotti di esempio

---

# Middleware JWT

Creare middleware dedicato:

```text
src/middleware/auth.middleware.ts
```

Responsabilità:

* leggere Authorization Header
* verificare JWT
* bloccare accessi non autorizzati
* restituire HTTP 401

---

# Frontend

Creare:

```text
public/index.html
```

senza framework.

Funzionalità:

## Login

Form:

```text
Username
Password
Pulsante Login
```

---

## Elenco prodotti

Visualizzare tutti i prodotti.

---

## Inserimento prodotto

Campi:

```text
Nome
Descrizione
Prezzo
```

---

## Modifica prodotto

Possibilità di aggiornare un prodotto.

---

## Eliminazione prodotto

Pulsante elimina.

---

## Logout

Pulsante logout che esegue:

```javascript
localStorage.removeItem('token');
```

---

# Gestione errori

Gestire:

* JWT non valido
* Login errato
* Record non trovato
* Errori database
* Errori validazione base

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

# Struttura progetto

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

# File .env.example

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=jwt_products_demo

JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1h
```

---

# package.json

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

# README

Creare un README completo che spieghi:

## Installazione

```bash
npm install
```

## Creazione database

```bash
mysql -u root -p < database.sql
```

## Configurazione

```bash
cp .env.example .env
```

## Seed

```bash
npm run seed
```

## Avvio

```bash
npm run dev
```

## Accesso

Aprire:

```text
http://localhost:3000
```

Credenziali:

```text
username: admin
password: password
```

---

# Git

Nel README inserire anche:

## Inizializzazione repository

```bash
git init
git add .
git commit -m "Initial commit - JWT Products CRUD"
```

## Collegamento repository remoto

```bash
git remote add origin URL_DEL_REPOSITORY
git branch -M main
git push -u origin main
```

---

# Requisiti didattici

Il codice deve essere:

* semplice da comprendere
* commentato
* organizzato per cartelle
* facilmente estendibile
* adatto a studenti che stanno imparando JWT e CRUD

---

# Output richiesto

Genera tutti i file completi del progetto:

* package.json
* tsconfig.json
* .env.example
* database.sql
* entities
* middleware JWT
* routes
* data-source.ts
* seed.ts
* server.ts
* frontend HTML/CSS/JS
* README.md

Il progetto deve essere eseguibile senza modifiche strutturali aggiuntive.
