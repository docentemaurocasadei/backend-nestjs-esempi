# guard-app — Esercizio su Guards e Throttling in NestJS

Questo progetto NestJS dimostra l'uso combinato di **Guard personalizzati** e **Rate Limiting (throttling)**.  
Il codice contiene degli errori intenzionali: il tuo obiettivo è individuarli e correggerli.

---

## Struttura del progetto

```
src/
├── app.module.ts                          ← configurazione globale
├── auth/api-key/api-key.guard.ts          ← guard autenticazione tramite API key
└── post-controller/
    └── post-controller.controller.ts      ← controller con route protetta
```

---

## Endpoint disponibili

| Metodo | Path               | Protezione                       |
|--------|--------------------|----------------------------------|
| GET    | `/`                | nessuna                          |
| GET    | `/posts`           | nessuna                          |
| GET    | `/posts/protected` | API Key + Throttle (max 5/60s)   |

---

## Come avviare il progetto

```bash
npm install
npm run start:dev
```

Il server ascolta su `http://localhost:3000`.

---

## Come testare il throttling

Usa curl, Postman, o qualsiasi client HTTP.

**Richiesta senza API key:**
```bash
curl http://localhost:3000/posts/protected
```

**Richiesta con API key valida:**
```bash
curl -H "x-api-key: 12345" http://localhost:3000/posts/protected
```

---

## L'esercizio

### Scenario

La route `GET /posts/protected` dovrebbe:

1. Rifiutare le richieste senza l'header `x-api-key: 12345` → risposta `403 Forbidden`
2. Permettere al massimo **5 richieste ogni 60 secondi** → risposta `429 Too Many Requests` al superamento del limite

### Cosa osservi

Esegui più di 5 volte di fila questa richiesta (almeno 6):
```bash
curl -H "x-api-key: 12345" http://localhost:3000/posts/protected
```

Ottieni il `429` dopo 5 richieste come ti aspetteresti? Qual è il comportamento effettivo?

Prova anche a capire:
- Cosa succede se mandi richieste **senza** API key? Vengono conteggiate nel throttle?
- Il `ThrottlerGuard` in `@UseGuards` è necessario, visto che è già registrato globalmente in `app.module.ts`?
- L'ordine `@UseGuards(ApiKeyGuard, ThrottlerGuard)` è corretto? Cosa succede se il primo guard blocca la richiesta?

### Domande guida

1. In `app.module.ts`, come viene registrato il `ThrottlerGuard`? È già attivo globalmente su tutte le route?
2. Nel controller, perché il `ThrottlerGuard` viene aggiunto di nuovo in `@UseGuards`? Cosa comporta averlo due volte sullo stesso route?
3. Cosa succede al conteggio delle richieste se lo stesso guard viene eseguito **due volte** sulla stessa route, usando la stessa chiave di storage?
4. Se `ApiKeyGuard` è il **primo** in `@UseGuards` e blocca la richiesta restituendo `false`, il `ThrottlerGuard` che segue viene ancora eseguito?
5. Come influisce l'ordine dei guard sul comportamento del throttling per richieste non autenticate?

---

## Obiettivo finale

Correggi `app.module.ts` e `post-controller.controller.ts` in modo che:

- `GET /posts/protected` senza API key restituisca `403`
- `GET /posts/protected` con API key valida risponda normalmente fino a 5 volte in 60 secondi
- Alla 6ª richiesta (con API key valida) restituisca `429 Too Many Requests`

> Consulta `SOLUTION.md` solo dopo aver tentato tu stesso.
