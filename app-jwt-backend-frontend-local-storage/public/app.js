const loginSection = document.getElementById('login-section');
const productsSection = document.getElementById('products-section');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const productForm = document.getElementById('product-form');
const productMessage = document.getElementById('product-message');
const productsTableBody = document.getElementById('products-table-body');
const logoutButton = document.getElementById('logout-button');
const cancelEditButton = document.getElementById('cancel-edit-button');
const formTitle = document.getElementById('form-title');

function getToken() {
  return localStorage.getItem('token');
}

function setMessage(element, text, type = 'info') {
  element.textContent = text;
  element.className = `message ${type}`;
}

function showAuthenticatedView() {
  loginSection.classList.add('hidden');
  productsSection.classList.remove('hidden');
  loadProducts();
}

function showLoginView() {
  productsSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
}

async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    // Tutte le chiamate protette usano il JWT letto da localStorage.
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    // Se il token non e valido, lo rimuoviamo e torniamo al login.
    localStorage.removeItem('token');
    showLoginView();
  }

  if (!response.ok) {
    throw new Error(data.message || 'Errore nella richiesta.');
  }

  return data;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(loginMessage, '');

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const data = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    localStorage.setItem('token', data.access_token);
    loginForm.reset();
    showAuthenticatedView();
  } catch (error) {
    setMessage(loginMessage, error.message, 'error');
  }
});

async function loadProducts() {
  try {
    const products = await apiFetch('/products');
    renderProducts(products);
  } catch (error) {
    setMessage(productMessage, error.message, 'error');
  }
}

function renderProducts(products) {
  productsTableBody.innerHTML = '';

  if (products.length === 0) {
    productsTableBody.innerHTML = '<tr><td colspan="4" class="empty-state">Nessun prodotto presente.</td></tr>';
    return;
  }

  products.forEach((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="product-name">${escapeHtml(product.name)}</span></td>
      <td><div class="product-description">${escapeHtml(product.description)}</div></td>
      <td><span class="price-badge">${formatPrice(product.price)}</span></td>
      <td class="row-actions">
        <button type="button" data-action="edit" data-id="${product.id}">Modifica</button>
        <button type="button" class="danger" data-action="delete" data-id="${product.id}">Elimina</button>
      </td>
    `;
    productsTableBody.appendChild(row);
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(price));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(productMessage, '');

  const id = document.getElementById('product-id').value;
  const payload = {
    name: document.getElementById('product-name').value.trim(),
    description: document.getElementById('product-description').value.trim(),
    price: Number(document.getElementById('product-price').value)
  };

  try {
    await apiFetch(id ? `/products/${id}` : '/products', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });

    resetProductForm();
    setMessage(productMessage, 'Prodotto salvato.', 'success');
    loadProducts();
  } catch (error) {
    setMessage(productMessage, error.message, 'error');
  }
});

productsTableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === 'edit') {
    await editProduct(id);
  }

  if (action === 'delete') {
    await deleteProduct(id);
  }
});

async function editProduct(id) {
  try {
    const product = await apiFetch(`/products/${id}`);
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    formTitle.textContent = 'Modifica prodotto';
    cancelEditButton.classList.remove('hidden');
  } catch (error) {
    setMessage(productMessage, error.message, 'error');
  }
}

async function deleteProduct(id) {
  const confirmed = window.confirm('Eliminare questo prodotto?');

  if (!confirmed) {
    return;
  }

  try {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    setMessage(productMessage, 'Prodotto eliminato.', 'success');
    loadProducts();
  } catch (error) {
    setMessage(productMessage, error.message, 'error');
  }
}

function resetProductForm() {
  productForm.reset();
  document.getElementById('product-id').value = '';
  formTitle.textContent = 'Nuovo prodotto';
  cancelEditButton.classList.add('hidden');
}

cancelEditButton.addEventListener('click', resetProductForm);

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('token');
  resetProductForm();
  showLoginView();
});

if (getToken()) {
  showAuthenticatedView();
} else {
  showLoginView();
}
