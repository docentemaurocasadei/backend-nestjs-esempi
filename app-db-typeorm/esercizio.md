# Esercizio: API NestJS con TypeORM

## Obiettivo

Partendo da questo progetto NestJS, completa e migliora una piccola API che gestisce province e localita turistiche usando TypeORM e MySQL.

Il progetto contiene gia:

- modulo `provinces`
- modulo `locations`
- entita `Province`
- entita `Location`
- relazione `Province` 1 - N `Location`
- repository TypeORM tramite `TypeOrmModule.forFeature`
- migrazioni TypeORM

## Preparazione

1. Crea o aggiorna il file `.env` con i dati del tuo database:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=app_db_typeorm
```

2. Installa le dipendenze:

```bash
npm install
```

3. Esegui le migrazioni:

```bash
npm run migration:run
```

4. Avvia il server:

```bash
npm run start:dev
```

## Parte 1 - Verifica CRUD base

Usando Postman, Insomnia, Swagger o `curl`, verifica che funzionino le rotte gia presenti.

### Province

Crea una provincia:

```http
POST http://localhost:3000/provinces
Content-Type: application/json

{
  "name": "Ancona",
  "code": "AN"
}
```

Leggi tutte le province:

```http
GET http://localhost:3000/provinces
```

Aggiorna una provincia:

```http
PATCH http://localhost:3000/provinces/1
Content-Type: application/json

{
  "name": "Provincia di Ancona"
}
```

Elimina una provincia:

```http
DELETE http://localhost:3000/provinces/1
```

### Localita

Crea una localita collegata a una provincia esistente:

```http
POST http://localhost:3000/locations
Content-Type: application/json

{
  "name": "Senigallia",
  "province_id": 1
}
```

Leggi tutte le localita:

```http
GET http://localhost:3000/locations
```

## Parte 2 - Caricare le relazioni

Modifica il servizio delle localita in modo che:

- `GET /locations` restituisca anche la provincia collegata
- `GET /locations/:id` restituisca anche la provincia collegata

Esempio di risposta attesa:

```json
[
  {
    "id": 1,
    "name": "Senigallia",
    "province_id": 1,
    "province": {
      "id": 1,
      "name": "Ancona",
      "code": "AN"
    }
  }
]
```

## Parte 3 - Endpoint province con localita

Modifica il servizio delle province in modo che:

- `GET /provinces` restituisca anche l'elenco delle localita
- `GET /provinces/:id` restituisca anche l'elenco delle localita

Esempio di risposta attesa:

```json
[
  {
    "id": 1,
    "name": "Ancona",
    "code": "AN",
    "locations": [
      {
        "id": 1,
        "name": "Senigallia",
        "province_id": 1
      }
    ]
  }
]
```

## Parte 4 - Validazione DTO

Completa la validazione dei DTO.

Requisiti:

- `CreateProvinceDto.code` deve essere una stringa non vuota lunga esattamente 2 caratteri
- `CreateLocationDto.province_id` deve essere un numero intero
- i DTO di update devono continuare a permettere aggiornamenti parziali

Suggerimento: usa i decorator di `class-validator`.

## Parte 5 - Vincolo univoco sul codice provincia

Aggiungi un vincolo univoco sulla colonna `code` dell'entita `Province`.

Requisiti:

- non devono esistere due province con lo stesso codice
- genera una nuova migrazione TypeORM
- esegui la migrazione
- verifica che una seconda provincia con lo stesso `code` venga rifiutata dal database

Comandi utili:

```bash
npm run migration:generate
npm run migration:run
npm run schema:log
```

## Parte 6 - Ricerca localita per provincia

Aggiungi una nuova rotta:

```http
GET /provinces/:id/locations
```

La rotta deve restituire solo le localita della provincia indicata.

Esempio:

```http
GET http://localhost:3000/provinces/1/locations
```

Risposta attesa:

```json
[
  {
    "id": 1,
    "name": "Senigallia",
    "province_id": 1
  }
]
```

## Consegna

Al termine dell'esercizio devi avere:

- API funzionante con CRUD per province e localita
- relazioni caricate nelle risposte principali
- DTO validati
- vincolo univoco sul codice provincia
- rotta `GET /provinces/:id/locations`
- migrazioni allineate al database

## Verifica finale

Esegui:

```bash
npm run build
npm run test
```

Poi prova manualmente almeno queste chiamate:

- `POST /provinces`
- `POST /locations`
- `GET /provinces`
- `GET /locations`
- `GET /provinces/1/locations`
