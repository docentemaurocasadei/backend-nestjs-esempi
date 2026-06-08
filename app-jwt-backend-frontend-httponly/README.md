# JWT HttpOnly Cookie Products CRUD

Progetto didattico full stack con Node.js, Express, TypeScript, TypeORM, MySQL, JWT salvato in cookie HttpOnly e frontend HTML, CSS e JavaScript Vanilla.

## Installazione

```bash
npm install
```

## Creazione database

```bash
mysql -u root -p < database.sql
```

## Configurazione ambiente

```bash
cp .env.example .env
```

Il file `.env.example` usa questi valori:

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

## Seed

```bash
npm run seed
```

Lo script crea l'utente iniziale e alcuni prodotti di esempio.

## Avvio progetto

```bash
npm run dev
```

## Apertura frontend

```text
http://localhost:3000
```

## Credenziali

```text
username: admin
password: password
```

## Rotte disponibili

```http
POST /login
POST /logout
GET /products
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id
```

Tutte le rotte `/products` sono protette dal middleware JWT. Il token non viene salvato in `localStorage`, `sessionStorage` o header `Authorization`; viene letto solo dal cookie HttpOnly.

## Istruzioni Git

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
