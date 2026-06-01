# Esercizio — app_base1 (NestJS Zoo API)

## Contesto

Hai a disposizione un'applicazione NestJS che gestisce gli animali di uno zoo.
L'app espone già un CRUD completo per la risorsa `animals` (`GET`, `POST`, `PATCH`, `DELETE`)
ed è protetta da un middleware che richiede l'header `x-api-key: zoo-key`.

---

## Obiettivo

Estendere l'applicazione completando i punti seguenti, **nell'ordine indicato**.

---

## Parte 1 — Aggiungere il campo `age` agli animali

1. Aggiungi la proprietà `age: number` all'interfaccia `Animal` in `animals.service.ts`.
2. Aggiungi `age` al DTO `CreateAnimalDto` con la validazione `@IsInt()` e `@Min(0)`.
3. Assicurati che `UpdateAnimalDto` erediti correttamente il campo (già fatto tramite `PartialType`).
4. Aggiorna il metodo `create` del service in modo che `age` venga salvato.

**Verifica**: chiamando `POST /animals` con body `{ "name": "Leo", "species": "Lion", "age": 5 }`
la risposta deve includere `"age": 5`.

---

## Parte 2 — Gestione degli errori HTTP nel service/controller

Attualmente, se si cerca un animale con un `id` inesistente, il controller restituisce `undefined`
(che NestJS trasforma in `200 OK` con body vuoto). Correggilo.

1. Nel `AnimalsController`, nel metodo `findOne`, lancia `NotFoundException` se il service
   restituisce `undefined`.
2. Fai lo stesso per `update` e `remove`: se il service restituisce `null`, lancia `NotFoundException`.

**Verifica**: `GET /animals/999` deve rispondere `404 Not Found` con body
`{ "statusCode": 404, "message": "Not Found" }`.

---

## Parte 3 — Nuovo modulo `keepers` (guardiani)

Crea un nuovo modulo NestJS per gestire i guardiani dello zoo.

### Entità / interfaccia

```ts
interface Keeper {
  id: number;
  firstName: string;
  lastName: string;
  assignedSpecies: string; // es. "Lion", "Elephant"
}
```

### Endpoint da implementare

| Metodo | Path            | Descrizione                        |
|--------|-----------------|------------------------------------|
| POST   | /keepers        | Crea un nuovo guardiano            |
| GET    | /keepers        | Restituisce tutti i guardiani      |
| GET    | /keepers/:id    | Restituisce un guardiano per id    |
| PATCH  | /keepers/:id    | Aggiorna parzialmente un guardiano |
| DELETE | /keepers/:id    | Elimina un guardiano               |

### Requisiti

- Crea `CreateKeeperDto` con validazione (`@IsString()`) per tutti i campi.
- Usa `PartialType` per `UpdateKeeperDto`.
- Gestisci `NotFoundException` per `findOne`, `update` e `remove`.
- Registra il modulo in `AppModule`.

**Verifica**: il middleware `ZooMiddleware` deve già proteggere automaticamente anche `/keepers`
(controlla la configurazione esistente in `AppModule`).

---

## Come testare

Usa [Postman](https://www.postman.com/) o `curl`. Ricordati sempre di includere l'header:

```
x-api-key: zoo-key
```

Esempio con curl:

```bash
curl -X POST http://localhost:3000/animals \
  -H "Content-Type: application/json" \
  -H "x-api-key: zoo-key" \
  -d '{"name":"Leo","species":"Lion","age":5}'
```

---

## File coinvolti (riepilogo)

```
src/
├── animals/
│   ├── dto/
│   │   ├── create-animal.dto.ts    ← modifica (Parte 1)
│   │   └── update-animal.dto.ts
│   ├── animals.controller.ts       ← modifica (Parte 2)
│   ├── animals.service.ts          ← modifica (Parti 1 e 2)
│   └── animals.module.ts
├── keepers/                        ← crea (Parte 3)
│   ├── dto/
│   │   ├── create-keeper.dto.ts
│   │   └── update-keeper.dto.ts
│   ├── keepers.controller.ts
│   ├── keepers.service.ts
│   └── keepers.module.ts
└── app.module.ts                   ← modifica (Parte 3)
```
