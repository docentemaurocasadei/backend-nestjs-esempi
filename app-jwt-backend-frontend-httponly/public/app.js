const loginPanel = document.getElementById('loginPanel');
const productsPanel = document.getElementById('productsPanel');
const loginForm = document.getElementById('loginForm');
const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('productsTableBody');
const messageBox = document.getElementById('message');
const logoutButton = document.getElementById('logoutButton');
const newProductButton = document.getElementById('newProductButton');
const cancelEditButton = document.getElementById('cancelEditButton');

function showMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function clearMessage() {
  messageBox.textContent = '';
  messageBox.className = 'message hidden';
}

function setLoggedIn(loggedIn) {
  loginPanel.classList.toggle('hidden', loggedIn);
  productsPanel.classList.toggle('hidden', !loggedIn);
  logoutButton.classList.toggle('hidden', !loggedIn);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Errore nella richiesta');
  }

  return data;
}

function resetProductForm() {
  productForm.reset();
  document.getElementById('productId').value = '';
  productForm.classList.add('hidden');
}

function fillProductForm(product) {
  document.getElementById('productId').value = product.id;
  document.getElementById('name').value = product.name;
  document.getElementById('description').value = product.description || '';
  document.getElementById('price').value = product.price;
  productForm.classList.remove('hidden');
}

function renderProducts(products) {
  productsTableBody.innerHTML = '';

  if (products.length === 0) {
    productsTableBody.innerHTML = '<tr><td colspan="4" class="empty">Nessun prodotto presente</td></tr>';
    return;
  }

  for (const product of products) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.description || ''}</td>
      <td>€ ${Number(product.price).toFixed(2)}</td>
      <td class="actions">
        <button class="secondary" data-action="edit" data-id="${product.id}">Modifica</button>
        <button class="danger" data-action="delete" data-id="${product.id}">Elimina</button>
      </td>
    `;
    productsTableBody.appendChild(row);
  }
}

async function loadProducts() {
  try {
    const products = await requestJson('/products');
    renderProducts(products);
    setLoggedIn(true);
  } catch (error) {
    setLoggedIn(false);
    showMessage(error.message, 'error');
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const result = await requestJson('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    showMessage(result.message, 'success');
    loginForm.reset();
    await loadProducts();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    const result = await requestJson('/logout', { method: 'POST' });
    resetProductForm();
    setLoggedIn(false);
    showMessage(result.message, 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

newProductButton.addEventListener('click', () => {
  resetProductForm();
  productForm.classList.remove('hidden');
});

cancelEditButton.addEventListener('click', resetProductForm);

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  const productId = document.getElementById('productId').value;
  const payload = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
  };

  try {
    await requestJson(productId ? `/products/${productId}` : '/products', {
      method: productId ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });

    resetProductForm();
    showMessage('Prodotto salvato', 'success');
    await loadProducts();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

productsTableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');

  if (!button) {
    return;
  }

  const id = button.dataset.id;

  if (button.dataset.action === 'edit') {
    try {
      const product = await requestJson(`/products/${id}`);
      fillProductForm(product);
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }

  if (button.dataset.action === 'delete') {
    const confirmed = window.confirm('Eliminare il prodotto selezionato?');

    if (!confirmed) {
      return;
    }

    try {
      await requestJson(`/products/${id}`, { method: 'DELETE' });
      showMessage('Prodotto eliminato', 'success');
      await loadProducts();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }
});

loadProducts();
