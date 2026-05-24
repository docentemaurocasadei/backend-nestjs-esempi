document.getElementById('loadBtnFetch').addEventListener('click', function() {
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(data => {
            loadProductsWithError(data);
        })
        .catch(error => {
            document.getElementById('message').textContent = 'Errore nel caricamento dei prodotti';
            console.error('Errore:', error);
        });
});
// Versione con async/await
  const button = document.getElementById('loadBtnAsyncAwait');

  button.addEventListener('click', loadProducts);

  async function loadProducts() {
    const message = document.getElementById('message');
    const productsList = document.getElementById('productsList');
    const template = document.getElementById('productCardTemplate');

    message.textContent = 'Caricamento prodotti...';
    productsList.innerHTML = '';

    try {
      const response = await fetch('http://localhost:3000/products');

      if (!response.ok) {
        throw new Error('Errore HTTP ' + response.status);
      }

      const products = await response.json();

      loadProductsWithError(products);

      message.textContent = 'Prodotti caricati: ' + products.length;
    } catch (error) {
      message.textContent = 'Errore nel caricamento dei prodotti';
      console.error('Errore:', error);
    }
  }
  function loadProductsWithError(data) {
    const message = document.getElementById('message');
    const productsList = document.getElementById('productsList');
    const template = document.getElementById('productCardTemplate');
    message.textContent = 'Caricamento prodotti...';
    productsList.innerHTML = '';
    try {
      data.forEach(product => {
        const card = template.content.cloneNode(true);
        card.querySelector('.product-name').textContent = product.name;
        card.querySelector('.product-description').textContent =
          product.description ?? 'Nessuna descrizione disponibile';
        card.querySelector('.product-price').textContent =
          product.price ? '€ ' + product.price : 'Prezzo non disponibile';
        productsList.appendChild(card);
      });   
        message.textContent = 'Prodotti caricati: ' + data.length;
    } catch (error) {
      message.textContent = 'Errore nel caricamento dei prodotti';
      console.error('Errore:', error);
    }
}
