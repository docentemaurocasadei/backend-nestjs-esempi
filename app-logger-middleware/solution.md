# Soluzione: Logger Middleware con NestJS e Winston

## `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

---

## `src/app.service.ts`

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

---

## `src/app.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

---

## `src/posts/posts.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  getPosts() {
    return 'Lista post';
  }
}
```

---

## `src/logger/logger.middleware.ts`

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}] ${message}`;
      }),
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/requests.log' }),
      new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
    ],
  });

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;

      if (res.statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.info(message);
      }
    });

    next();
  }
}
```

### Punti chiave del middleware

- **`res.on('finish', ...)`** — l'evento `finish` scatta quando la risposta è stata inviata al client: solo a quel punto `statusCode` e la durata sono definitivi.
- **`Date.now()` prima di `next()`** — misura il tempo dall'inizio della gestione, non dall'arrivo del socket.
- **`next()`** — chiamato subito: il middleware non blocca la catena, il log avviene in modo asincrono a risposta completata.
- **Due file di log separati** — Winston supporta più transport sulla stessa istanza; il filtro `level: 'error'` sul secondo file esclude automaticamente i livelli inferiori.

---

## `src/app.module.ts`

```typescript
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { PostsController } from './posts/posts.controller';

@Module({
  imports: [],
  controllers: [AppController, PostsController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
```

### Punti chiave del modulo

- `AppModule` implementa il metodo `configure` (non è un'interfaccia obbligatoria, ma è la convenzione NestJS per i middleware).
- `.forRoutes('*')` applica il middleware a **tutte** le route registrate nell'applicazione.
- `PostsController` deve essere presente nell'array `controllers` altrimenti NestJS non lo registra.

---

## Verifica

Avvia l'app:

```bash
npm run start:dev
```

Test rapido con curl:

```bash
curl http://localhost:3000/          # 200 → log info
curl http://localhost:3000/posts     # 200 → log info
curl http://localhost:3000/xyz       # 404 → log error
```

Output atteso in console (esempio):

```
2025-05-23T10:00:01.123Z [info]  GET / - 200 - 5ms
2025-05-23T10:00:02.456Z [info]  GET /posts - 200 - 2ms
2025-05-23T10:00:03.789Z [error] GET /xyz - 404 - 3ms
```

Il file `logs/errors.log` conterrà **solo** la riga dell'errore 404.
