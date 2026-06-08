# Esercizio: Guard con Ruoli in NestJS

## Obiettivo

Implementare un sistema di autorizzazione basato su ruoli in NestJS senza un sistema di autenticazione reale.
Il ruolo dell'utente viene simulato tramite un **header HTTP personalizzato** (`x-role-key`) nella request.

---

## Requisiti

### 1. Enum dei Ruoli

Definire un enum `Role` con almeno due valori:

```ts
export enum Role {
  Admin = 'admin',
  User = 'user',
}
```

---

### 2. Decorator `@Roles()`

Creare un decorator custom che permetta di annotare controller o singoli handler con i ruoli richiesti per accedervi:

```ts
@Roles(Role.Admin)
@Get('admin')
getAdminStuff() { ... }
```

Il decorator deve salvare i ruoli nei metadati tramite `SetMetadata`.

---

### 3. Guard Fake Auth (`FakeAuthGuard`)

Creare un guard che **simuli l'autenticazione** leggendo l'header `x-role-key` dalla request HTTP:

| Valore header `x-role-key` | Ruolo assegnato |
|----------------------------|-----------------|
| `admin-key`                | `Role.Admin`    |
| `user-key`                 | `Role.User`     |
| *(assente o altro)*        | `Role.User`     |

Il guard deve:
- Leggere l'header dalla request
- Costruire un oggetto `user` con `id`, `username` e `roles`
- Iniettarlo in `request.user`
- Restituire sempre `true` (non blocca mai, si limita a popolare l'utente)

---

### 4. Guard Ruoli (`RolesGuard`)

Creare un guard che **verifichi l'autorizzazione** controllando se il ruolo dell'utente corrente
(presente in `request.user.roles`) è tra quelli richiesti dall'handler.

Il guard deve:
- Usare il `Reflector` per leggere i metadati `roles` dall'handler o dal controller
- Se non ci sono metadati di ruolo, lasciare passare la request
- Confrontare i ruoli dell'utente con quelli richiesti

---

### 5. Controller `PostsController`

Creare un controller `/posts` che applichi **entrambi i guard** a livello di controller e abbia tre endpoint:

| Metodo | Path          | Ruolo richiesto | Descrizione                     |
|--------|---------------|-----------------|---------------------------------|
| GET    | `/posts`      | *(nessuno)*     | Pubblica, accessibile a tutti   |
| POST   | `/posts/admin`| `Role.Admin`    | Solo per admin                  |
| POST   | `/posts/user` | `Role.User`     | Solo per utenti standard        |

---

## Come testare

Avvia l'app:

```bash
npm run start:dev
```

Poi testa con curl o un client HTTP (es. Thunder Client, Postman):

```bash
# Endpoint pubblico (tutti)
GET http://localhost:3000/posts

# Endpoint admin - con chiave admin
POST http://localhost:3000/posts/admin
Header: x-role-key: admin-key
Body: { "titolo": "Post admin" }

# Endpoint admin - con chiave user (deve restituire 403)
POST http://localhost:3000/posts/admin
Header: x-role-key: user-key

# Endpoint user - con chiave user
POST http://localhost:3000/posts/user
Header: x-role-key: user-key
Body: { "titolo": "Post utente" }
```

---

## Struttura attesa del progetto

```
src/
├── auth/
│   ├── role.enum.ts
│   ├── fake-auth/
│   │   └── fake-auth.guard.ts
│   └── roles/
│       ├── roles.decorator.ts
│       └── roles.guard.ts
├── posts/
│   └── posts.controller.ts
├── app.module.ts
└── main.ts
```
