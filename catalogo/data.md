# Migration
npx typeorm-ts-node-commonjs migration:generate src/migrations/NomeMigration -d src/data-source.ts

npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts

# Dati da inserire

curl -X POST http://localhost:3000/categories \
-H "Content-Type: application/json" \
-d '{ 
  "name": "Panini",
  "description": "Hamburger e panini"
}'

curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-d '{
  "name": "Cheeseburger",
  "description": "Hamburger con formaggio",
  "price": 9.90,
  "categoryId": 1
}'

curl -X POST http://localhost:3000/categories \
-H "Content-Type: application/json" \
-d '{
  "name": "Bibite",
  "description": "Bevande e soft drink"
}'

curl -X POST http://localhost:3000/categories \
-H "Content-Type: application/json" \
-d '{
  "name": "Dolci",
  "description": "Dessert e dolci artigianali"
}'

curl -X POST http://localhost:3000/categories \
-H "Content-Type: application/json" \
-d '{
  "name": "Dolci",
  "description": "Dessert e dolci artigianali"
}'



curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-d '{
  "name": "Double Bacon Burger",
  "description": "Doppio hamburger con bacon",
  "price": 11.90,
  "categoryId": 1
}'
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-d '{
  "name": "Coca Cola",
  "description": "Bibita gassata",
  "price": 3.00,
  "categoryId": 2
}'
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-d '{
  "name": "Acqua Naturale",
  "description": "Bottiglia da 50cl",
  "price": 1.50,
  "categoryId": 2
}'
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-d '{
  "name": "Tiramisù",
  "description": "Dolce al mascarpone",
  "price": 5.50,
  "categoryId": 3
}'
