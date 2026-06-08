import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { authMiddleware } from '../middleware/auth.middleware';

export const productRouter = Router();

productRouter.use(authMiddleware);

function validateProductInput(body: Record<string, unknown>) {
  const name = String(body.name || '').trim();
  const description = String(body.description || '').trim();
  const price = Number(body.price);

  // Validazione base sufficiente per mostrare il flusso CRUD.
  if (!name || !description || Number.isNaN(price) || price < 0) {
    return null;
  }

  return {
    name,
    description,
    price: price.toFixed(2)
  };
}

productRouter.get('/products', async (_req, res) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find({ order: { id: 'DESC' } });
    return res.json(products);
  } catch {
    return res.status(500).json({ message: 'Errore nel recupero dei prodotti.' });
  }
});

productRouter.get('/products/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID prodotto non valido.' });
  }

  try {
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato.' });
    }

    return res.json(product);
  } catch {
    return res.status(500).json({ message: 'Errore nel recupero del prodotto.' });
  }
});

productRouter.post('/products', async (req, res) => {
  const validProduct = validateProductInput(req.body);

  if (!validProduct) {
    return res.status(400).json({ message: 'Nome, descrizione e prezzo valido sono obbligatori.' });
  }

  try {
    const productRepository = AppDataSource.getRepository(Product);
    const product = productRepository.create(validProduct);
    const savedProduct = await productRepository.save(product);
    return res.status(201).json(savedProduct);
  } catch {
    return res.status(500).json({ message: 'Errore nella creazione del prodotto.' });
  }
});

productRouter.put('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const validProduct = validateProductInput(req.body);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID prodotto non valido.' });
  }

  if (!validProduct) {
    return res.status(400).json({ message: 'Nome, descrizione e prezzo valido sono obbligatori.' });
  }

  try {
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato.' });
    }

    productRepository.merge(product, validProduct);
    const updatedProduct = await productRepository.save(product);
    return res.json(updatedProduct);
  } catch {
    return res.status(500).json({ message: 'Errore nella modifica del prodotto.' });
  }
});

productRouter.delete('/products/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID prodotto non valido.' });
  }

  try {
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato.' });
    }

    await productRepository.remove(product);
    return res.json({ message: 'Prodotto eliminato.' });
  } catch {
    return res.status(500).json({ message: 'Errore nella cancellazione del prodotto.' });
  }
});
