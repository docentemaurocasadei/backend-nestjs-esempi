# JWT Products Demo

Progetto didattico con Node.js, Express, TypeScript, TypeORM, MySQL, JWT e frontend HTML/CSS/JavaScript Vanilla.

L'applicazione mostra:

- login con JWT;
- token salvato in `localStorage`;
- rotte protette con middleware;
- CRUD completo dei prodotti;
- frontend con Fetch API.

## Requisiti

- Node.js
- MySQL
- npm

## Installazione

```bash
npm install
```

## Creazione database

```bash
mysql -u root -p < database.sql
```

Il file `database.sql` crea il database `jwt_products_demo` e le tabelle `users` e `products`.

## Configurazione

```bash
cp .env.example .env
```

Modificare `.env` solo se le credenziali MySQL locali sono diverse.

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

## Seed

```bash
npm run seed
```

Lo script crea:

- utente `admin`;
- password `password` salvata con hash bcrypt;
- alcuni prodotti di esempio.

## Avvio

```bash
npm run dev
```

Aprire:

```text
http://localhost:3000
```

Credenziali:

```text
username: admin
password: password
```

## API

### Login

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

Risposta:

```json
{
  "access_token": "JWT_TOKEN"
}
```

### Prodotti

Tutte le rotte prodotti richiedono header JWT:

```http
Authorization: Bearer JWT_TOKEN
```

Rotte disponibili:

```http
GET /products
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id
```

## Frontend

Il frontend si trova in `public/` ed e servito direttamente da Express.

Il token JWT viene salvato esclusivamente in `localStorage`:

```javascript
localStorage.setItem('token', data.access_token);
```

Il logout rimuove il token:

```javascript
localStorage.removeItem('token');
```

## Build produzione

```bash
npm run build
npm start
```

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
