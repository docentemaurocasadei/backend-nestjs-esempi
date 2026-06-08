# Soluzione: Guard con Ruoli in NestJS

## Approccio generale

La soluzione usa **due guard in sequenza** applicati a livello di controller:

1. `FakeAuthGuard` — popola `request.user` simulando l'autenticazione tramite header
2. `RolesGuard` — legge `request.user` e confronta i ruoli con quelli richiesti dall'handler

NestJS esegue i guard nell'ordine in cui sono dichiarati in `@UseGuards(...)`, quindi l'ordine è fondamentale: il `FakeAuthGuard` deve sempre andare prima.

---

## File della soluzione

### `src/auth/role.enum.ts`

```ts
export enum Role {
  Admin = 'admin',
  User = 'user',
}
```

Enum semplice che centralizza i valori dei ruoli disponibili. Usare stringhe (invece di numeri) rende i log e i metadati leggibili.

---

### `src/auth/roles/roles.decorator.ts`

```ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args);
```

`SetMetadata` è il meccanismo di NestJS per attaccare dati arbitrari a handler o controller.
`ROLES_KEY` è la chiave con cui il `RolesGuard` recupererà poi quei dati tramite il `Reflector`.

---

### `src/auth/fake-auth/fake-auth.guard.ts`

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../role.enum';

@Injectable()
export class FakeAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const roleKey = request.headers['x-role-key'];
    let roles = [Role.User];

    if (roleKey === 'admin-key') {
      roles = [Role.Admin];
    }

    if (roleKey === 'user-key') {
      roles = [Role.User];
    }

    request.user = {
      id: 1,
      username: 'testuser',
      roles,
    };

    return true;
  }
}
```

**Punti chiave:**
- `context.switchToHttp().getRequest()` restituisce la request Express/Fastify
- L'header `x-role-key` è letto da `request.headers` (NestJS/Express normalizza i nomi degli header in lowercase)
- Il guard restituisce sempre `true`: non è responsabile dell'autorizzazione, solo di popolare `request.user`
- In un'app reale questo guard sarebbe sostituito da JWT o session-based auth

---

### `src/auth/roles/roles.guard.ts`

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.some(role => user.roles.includes(role));
  }
}
```

**Punti chiave:**
- `Reflector` viene iniettato tramite il costruttore — questo richiede che il guard sia un provider `@Injectable()`
- `getAllAndOverride` cerca i metadati prima sull'handler (`getHandler()`), poi sul controller (`getClass()`): il decorator sull'handler vince su quello del controller
- Se nessun `@Roles(...)` è presente, `roles` è `undefined` → si restituisce `true` (endpoint pubblico)
- `roles.some(...)` implementa la logica **OR**: basta avere almeno uno dei ruoli richiesti

---

### `src/posts/posts.controller.ts`

```ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FakeAuthGuard } from '../auth/fake-auth/fake-auth.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('posts')
@UseGuards(FakeAuthGuard, RolesGuard)
export class PostsController {
  @Get()
  getPosts() {
    return 'Lista post pubblica';
  }

  @Roles(Role.Admin)
  @Post('admin')
  getAdminPosts(@Body() body: any) {
    return { message: 'Post visibili solo agli admin', body };
  }

  @Roles(Role.User)
  @Post('user')
  getUserPosts(@Body() body: any) {
    return { message: 'Post visibili solo agli user', body };
  }
}
```

**Punti chiave:**
- `@UseGuards(FakeAuthGuard, RolesGuard)` sul controller applica entrambi i guard a tutti gli handler
- `@Get()` non ha `@Roles(...)`: il `RolesGuard` restituisce `true` e l'endpoint è pubblico
- Il `Reflector` con `getAllAndOverride` fa sì che il decorator sull'handler (es. `@Roles(Role.Admin)`) abbia la precedenza su un eventuale decorator sul controller

---

### `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';

@Module({
  imports: [],
  controllers: [AppController, PostsController],
  providers: [AppService],
})
export class AppModule {}
```

**Nota:** `RolesGuard` usa il `Reflector` che è un provider built-in di NestJS (`@nestjs/core`).
Non serve registrarlo esplicitamente nei `providers` del modulo perché i guard applicati con `@UseGuards()` a livello di controller vengono istanziati dal DI container di NestJS che conosce già il `Reflector`.

Se il guard fosse registrato globalmente con `APP_GUARD`, il `Reflector` andrebbe fornito esplicitamente.

---

## Flusso di una request

```
POST /posts/admin
Header: x-role-key: admin-key

1. FakeAuthGuard.canActivate()
   → legge header 'admin-key'
   → request.user = { id: 1, username: 'testuser', roles: ['admin'] }
   → return true

2. RolesGuard.canActivate()
   → Reflector legge @Roles(Role.Admin) sull'handler
   → roles = ['admin']
   → user.roles.includes('admin') = true
   → return true

3. Handler eseguito → { message: 'Post visibili solo agli admin', body: {...} }
```

```
POST /posts/admin
Header: x-role-key: user-key

1. FakeAuthGuard.canActivate()
   → request.user = { roles: ['user'] }
   → return true

2. RolesGuard.canActivate()
   → roles = ['admin']
   → user.roles.includes('admin') = false
   → return false → 403 Forbidden
```
