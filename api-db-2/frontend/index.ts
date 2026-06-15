const API_URL = '/api/products';

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: string;
    sku?: string | null;
    image_path?: string;
    alt_text?: string;
};

function hasAuth(): boolean {
    return document.cookie.includes('auth=');
}

async function request(url: string, options?: RequestInit) {
    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error('Errore API');
    }

    return res.json();
}

function flash(message: string, type: 'success' | 'error' = 'success') {
    const box = document.getElementById('flash');
    if (!box) return;

    box.textContent = message;
    box.className = `flash ${type}`;
    box.style.display = 'block';

    setTimeout(() => {
        box.style.display = 'none';
    }, 3000);
}

async function getAll(): Promise<Product[]> {
    return await request(API_URL);
}

async function getOne(id: string): Promise<Product> {
    const data = await request(`${API_URL}/${id}`);
    return Array.isArray(data) ? data[0] : data;
}

async function loadProducts() {
    const products = await getAll();
    const container = document.getElementById('products');
    const template = document.getElementById('productCardTemplate') as HTMLTemplateElement;

    if (!container || !template) return;

    container.innerHTML = '';

    products.forEach((product) => {
        const clone = template.content.cloneNode(true) as DocumentFragment;

        const image = clone.querySelector('.product-image') as HTMLImageElement;
        const link = clone.querySelector('.product-link') as HTMLAnchorElement;

        image.src = product.image_path ? `/${product.image_path}` : 'https://placehold.co/600x400?text=Burger';
        image.alt = product.alt_text ?? product.name;
        link.href = `/product.html?id=${product.id}`;

        (clone.querySelector('.product-name') as HTMLElement).textContent = product.name;
        (clone.querySelector('.product-description') as HTMLElement).textContent = product.description;
        (clone.querySelector('.product-price') as HTMLElement).textContent = product.base_price;

        if (hasAuth()) {
            const adminButtons = clone.querySelector('.admin-buttons') as HTMLElement;
            const editLink = clone.querySelector('.edit-link') as HTMLAnchorElement;
            const deleteButton = clone.querySelector('.delete-button') as HTMLButtonElement;

            adminButtons.classList.remove('d-none');
            editLink.href = `/product-edit.html?id=${product.id}`;
            deleteButton.addEventListener('click', () => deleteProduct(String(product.id)));
        }

        container.appendChild(clone);
    });
}

async function loadProductView(id: string | null) {
  if (!id) return;

  const product = await getOne(id);
  const container = document.getElementById('productView');
  const template = document.getElementById('productViewTemplate') as HTMLTemplateElement;

  if (!container || !template) return;

  const clone = template.content.cloneNode(true) as DocumentFragment;

  const image = clone.querySelector('.product-image') as HTMLImageElement;
  image.src = product.image_path ? `/${product.image_path}` : 'https://placehold.co/700x500?text=Burger';
  image.alt = product.alt_text ?? product.name;

  (clone.querySelector('.product-name') as HTMLElement).textContent = product.name;
  (clone.querySelector('.product-description') as HTMLElement).textContent = product.description;
  (clone.querySelector('.product-price') as HTMLElement).textContent = product.base_price;
  (clone.querySelector('.product-slug') as HTMLElement).textContent = product.slug;
  (clone.querySelector('.product-sku') as HTMLElement).textContent = product.sku ?? '-';

  if (hasAuth()) {
    const adminButtons = clone.querySelector('.admin-buttons') as HTMLElement;
    const editLink = clone.querySelector('.edit-link') as HTMLAnchorElement;
    const deleteButton = clone.querySelector('.delete-button') as HTMLButtonElement;

    adminButtons.classList.remove('d-none');
    editLink.href = `/product-edit.html?id=${product.id}`;
    deleteButton.addEventListener('click', () => deleteProduct(String(product.id)));
  }

  container.innerHTML = '';
  container.appendChild(clone);
}

async function loadProductForm(id: string) {
    const product = await getOne(id);

    (document.getElementById('id') as HTMLInputElement).value = String(product.id);
    (document.getElementById('name') as HTMLInputElement).value = product.name;
    (document.getElementById('slug') as HTMLInputElement).value = product.slug;
    (document.getElementById('description') as HTMLTextAreaElement).value = product.description;
    (document.getElementById('base_price') as HTMLInputElement).value = product.base_price;
    (document.getElementById('sku') as HTMLInputElement).value = product.sku ?? '';
}

async function saveProduct(id: string | null) {
    try {
        const payload = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            slug: (document.getElementById('slug') as HTMLInputElement).value,
            description: (document.getElementById('description') as HTMLTextAreaElement).value,
            base_price: (document.getElementById('base_price') as HTMLInputElement).value,
            sku: (document.getElementById('sku') as HTMLInputElement).value,
        };

        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PATCH' : 'POST';

        const saved = await request(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        flash('Prodotto salvato correttamente', 'success');

        setTimeout(() => {
            const productId = id ?? saved.id;
            location.href = `/product.html?id=${productId}`;
        }, 800);

    } catch {
        flash('Errore durante il salvataggio', 'error');
    }
}

async function deleteProduct(id: string | null) {
    if (!id) return;

    const ok = confirm('Vuoi eliminare questo prodotto?');
    if (!ok) return;

    await request(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    location.href = '/';
}

(window as any).hasAuth = hasAuth;
(window as any).loadProducts = loadProducts;
(window as any).loadProductView = loadProductView;
(window as any).loadProductForm = loadProductForm;
(window as any).saveProduct = saveProduct;
(window as any).deleteProduct = deleteProduct;