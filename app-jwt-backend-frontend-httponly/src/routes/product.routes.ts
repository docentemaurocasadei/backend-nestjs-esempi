import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { authMiddleware } from '../middleware/auth.middleware';

export const productRouter = Router();

productRouter.use(authMiddleware);

function validateProductInput(body: { name?: string; description?: string; price?: unknown }) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const description =
    typeof body.description === 'string' && body.description.trim().length > 0
      ? body.description.trim()
      : null;
  const price = Number(body.price);

  if (!name) {
    return { error: 'Il nome e obbligatorio' };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { error: 'Il prezzo deve essere un numero valido maggiore o uguale a zero' };
  }

  return {
    value: {
      name,
      description,
      price: price.toFixed(2),
    },
  };
}

productRouter.get('/', async (_req, res) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find({ order: { id: 'ASC' } });
    return res.status(200).json(products);
  } catch {
    return res.status(500).json({ message: 'Errore durante il recupero dei prodotti' });
  }
});

productRouter.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID prodotto non valido' });
    }

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    return res.status(200).json(product);
  } catch {
    return res.status(500).json({ message: 'Errore durante il recupero del prodotto' });
  }
});

productRouter.post('/', async (req, res) => {
  try {
    const validated = validateProductInput(req.body);

    if ('error' in validated) {
      return res.status(400).json({ message: validated.error });
    }

    const productRepository = AppDataSource.getRepository(Product);
    const product = productRepository.create(validated.value);
    const savedProduct = await productRepository.save(product);

    return res.status(201).json(savedProduct);
  } catch {
    return res.status(500).json({ message: 'Errore durante la creazione del prodotto' });
  }
});

productRouter.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID prodotto non valido' });
    }

    const validated = validateProductInput(req.body);

    if ('error' in validated) {
      return res.status(400).json({ message: validated.error });
    }

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    productRepository.merge(product, validated.value);
    const updatedProduct = await productRepository.save(product);

    return res.status(200).json(updatedProduct);
  } catch {
    return res.status(500).json({ message: 'Errore durante la modifica del prodotto' });
  }
});

productRouter.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID prodotto non valido' });
    }

    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    await productRepository.remove(product);
    return res.status(200).json({ message: 'Prodotto eliminato' });
  } catch {
    return res.status(500).json({ message: 'Errore durante la cancellazione del prodotto' });
  }
});
