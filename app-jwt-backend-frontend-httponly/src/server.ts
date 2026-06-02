import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { AppDataSource } from './data-source';
import { authRouter } from './routes/auth.routes';
import { productRouter } from './routes/product.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(authRouter);
app.use('/products', productRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Rotta non trovata' });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server avviato su http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Errore di connessione al database:', error);
    process.exit(1);
  });
