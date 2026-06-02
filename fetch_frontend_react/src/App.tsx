import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';

type Product = {
  name: string;
  description?: string;
  price?: number;
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');

  async function loadProducts() {
    setMessage('Caricamento prodotti...');

    try {
      const response = await fetch('http://localhost:3000/products');

      if (!response.ok) {
        throw new Error('Errore HTTP ' + response.status);
      }

      const data: Product[] = await response.json();

      setProducts(data);
      setMessage('Prodotti caricati: ' + data.length);
    } catch (error) {
      setMessage('Errore nel caricamento dei prodotti');
      console.error(error);
    }
  }

  return (
<>
    <Navbar />

    <main className="container mt-4">
    <button onClick={loadProducts}>Carica prodotti</button>

    <p>{message}</p>

    <div className="products-grid">
      {products.map((product, index) => (
        <div className="product-card" key={index}>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description ?? 'Nessuna descrizione disponibile'}
          </p>
          <p className="product-price">
            {product.price ? '€ ' + product.price : 'Prezzo non disponibile'}
          </p>
        </div>
      ))}
    </div>
      </main>
  </>
);
}

export default App;