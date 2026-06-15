"use strict";
const API_URL = '/api/products';
function hasAuth() {
    return document.cookie.includes('auth=');
}
async function request(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error('Errore API');
    }
    return res.json();
}
function flash(message, type = 'success') {
    const box = document.getElementById('flash');
    if (!box)
        return;
    box.textContent = message;
    box.className = `flash ${type}`;
    box.style.display = 'block';
    setTimeout(() => {
        box.style.display = 'none';
    }, 3000);
}
async function getAll() {
    return await request(API_URL);
}
async function getOne(id) {
    const data = await request(`${API_URL}/${id}`);
    return Array.isArray(data) ? data[0] : data;
}
async function loadProducts() {
    const products = await getAll();
    const container = document.getElementById('products');
    const template = document.getElementById('productCardTemplate');
    if (!container || !template)
        return;
    container.innerHTML = '';
    products.forEach((product) => {
        const clone = template.content.cloneNode(true);
        const image = clone.querySelector('.product-image');
        const link = clone.querySelector('.product-link');
        image.src = product.image_path ? `/${product.image_path}` : 'https://placehold.co/600x400?text=Burger';
        image.alt = product.alt_text ?? product.name;
        link.href = `/product.html?id=${product.id}`;
        clone.querySelector('.product-name').textContent = product.name;
        clone.querySelector('.product-description').textContent = product.description;
        clone.querySelector('.product-price').textContent = product.base_price;
        if (hasAuth()) {
            const adminButtons = clone.querySelector('.admin-buttons');
            const editLink = clone.querySelector('.edit-link');
            const deleteButton = clone.querySelector('.delete-button');
            adminButtons.classList.remove('d-none');
            editLink.href = `/product-edit.html?id=${product.id}`;
            deleteButton.addEventListener('click', () => deleteProduct(String(product.id)));
        }
        container.appendChild(clone);
    });
}
async function loadProductView(id) {
    if (!id)
        return;
    const product = await getOne(id);
    const container = document.getElementById('productView');
    const template = document.getElementById('productViewTemplate');
    if (!container || !template)
        return;
    const clone = template.content.cloneNode(true);
    const image = clone.querySelector('.product-image');
    image.src = product.image_path ? `/${product.image_path}` : 'https://placehold.co/700x500?text=Burger';
    image.alt = product.alt_text ?? product.name;
    clone.querySelector('.product-name').textContent = product.name;
    clone.querySelector('.product-description').textContent = product.description;
    clone.querySelector('.product-price').textContent = product.base_price;
    clone.querySelector('.product-slug').textContent = product.slug;
    clone.querySelector('.product-sku').textContent = product.sku ?? '-';
    if (hasAuth()) {
        const adminButtons = clone.querySelector('.admin-buttons');
        const editLink = clone.querySelector('.edit-link');
        const deleteButton = clone.querySelector('.delete-button');
        adminButtons.classList.remove('d-none');
        editLink.href = `/product-edit.html?id=${product.id}`;
        deleteButton.addEventListener('click', () => deleteProduct(String(product.id)));
    }
    container.innerHTML = '';
    container.appendChild(clone);
}
async function loadProductForm(id) {
    const product = await getOne(id);
    document.getElementById('id').value = String(product.id);
    document.getElementById('name').value = product.name;
    document.getElementById('slug').value = product.slug;
    document.getElementById('description').value = product.description;
    document.getElementById('base_price').value = product.base_price;
    document.getElementById('sku').value = product.sku ?? '';
}
async function saveProduct(id) {
    try {
        const payload = {
            name: document.getElementById('name').value,
            slug: document.getElementById('slug').value,
            description: document.getElementById('description').value,
            base_price: document.getElementById('base_price').value,
            sku: document.getElementById('sku').value,
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
    }
    catch {
        flash('Errore durante il salvataggio', 'error');
    }
}
async function deleteProduct(id) {
    if (!id)
        return;
    const ok = confirm('Vuoi eliminare questo prodotto?');
    if (!ok)
        return;
    await request(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    location.href = '/';
}
window.hasAuth = hasAuth;
window.loadProducts = loadProducts;
window.loadProductView = loadProductView;
window.loadProductForm = loadProductForm;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
