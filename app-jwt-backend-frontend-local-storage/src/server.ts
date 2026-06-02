import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { AppDataSource } from './data-source';
import { authRouter } from './routes/auth.routes';
import { productRouter } from './routes/product.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
// Express serve il frontend vanilla dalla cartella public.
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(authRouter);
app.use(productRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Rotta non trovata.' });
});

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('Connessione al database riuscita.');

    app.listen(port, () => {
      console.log(`Server avviato su http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Errore di avvio applicazione:', error);
    process.exit(1);
  }
}

startServer();
