# Esercizio: Logger Middleware con NestJS e Winston

## Obiettivo

Costruire da zero un'applicazione NestJS che registra ogni richiesta HTTP in arrivo tramite un middleware personalizzato, usando la libreria **Winston** come logger.

---

## Requisiti funzionali

Alla fine dell'esercizio l'app deve:

1. Rispondere su `GET /` con la stringa `Hello World!`
2. Rispondere su `GET /posts` con la stringa `Lista post`
3. Per **ogni** richiesta ricevuta, loggare una riga nel formato:

```
<timestamp> [<level>] <METHOD> <url> - <statusCode> - <ms>ms
```

Esempi:

```
2025-05-23T10:00:01.234Z [info]  GET / - 200 - 4ms
2025-05-23T10:00:05.789Z [error] GET /non-esiste - 404 - 2ms
```

4. I log devono andare in tre destinazioni contemporaneamente:
   - **Console**
   - File `logs/requests.log` (tutti i livelli)
   - File `logs/errors.log` (solo errori, cioè status >= 400)

---

## Passi guidati

### 1. Crea il progetto

```bash
nest new app-logger-middleware
cd app-logger-middleware
```

### 2. Installa Winston

```bash
npm install winston
```

### 3. Crea il controller `PostsController`

Genera un controller per la risorsa `posts` che risponde su `GET /posts`.

> Suggerimento: usa `nest generate controller posts` oppure crea il file manualmente in `src/posts/`.

### 4. Crea il middleware `LoggerMiddleware`

Crea il file `src/logger/logger.middleware.ts`.

Il middleware deve:

- Implementare l'interfaccia `NestMiddleware`
- Essere decorato con `@Injectable()`
- Avere un'istanza privata di logger Winston con:
  - `level: 'info'`
  - Formato combinato: `timestamp` + `printf` personalizzato
  - Tre transport: `Console`, `File` (`logs/requests.log`), `File` (`logs/errors.log`, solo `error`)
- Nel metodo `use(req, res, next)`:
  - Registrare il momento di inizio richiesta (`Date.now()`)
  - Ascoltare l'evento `'finish'` sulla risposta per calcolare la durata
  - Costruire il messaggio: `METHOD url - statusCode - Xms`
  - Chiamare `logger.error()` se `statusCode >= 400`, altrimenti `logger.info()`
  - Chiamare `next()` per passare al gestore successivo

### 5. Registra il middleware in `AppModule`

In `src/app.module.ts`:

- Importa `MiddlewareConsumer` da `@nestjs/common`
- Implementa il metodo `configure(consumer: MiddlewareConsumer)` nella classe `AppModule`
- Applica `LoggerMiddleware` a tutte le route (`'*'`)
- Aggiungi `PostsController` all'array `controllers`

### 6. Avvia e testa

```bash
npm run start:dev
```

Prova le seguenti chiamate con un client HTTP (curl, browser, Postman, Thunder Client):

| URL                          | Risposta attesa  | Log atteso |
|------------------------------|------------------|------------|
| `GET http://localhost:3000/` | `Hello World!`   | `[info]`   |
| `GET http://localhost:3000/posts` | `Lista post` | `[info]`   |
| `GET http://localhost:3000/xyz`   | 404 Not Found | `[error]`  |

Verifica che i file `logs/requests.log` e `logs/errors.log` vengano creati e popolati correttamente.

---

## Struttura finale attesa

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── logger/
│   └── logger.middleware.ts
└── posts/
    └── posts.controller.ts
logs/
├── requests.log
└── errors.log
```
