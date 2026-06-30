const API_URL = '/api';

async function fetchProducts(retry = true) {
    const productsContainer = document.getElementById('products-container');
    const productTemplate = document.getElementById('product-template');

    const response = await fetch(`${API_URL}/products`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    });

    if (response.status === 401 && retry) {
        const newToken = await refreshToken();

        if (!newToken) {
            window.location.href = 'login.html';
            return;
        }

        return fetchProducts(false);
    }

    if (!response.ok) {
        window.location.href = 'login.html';
        return;
    }

    const products = await response.json();

    productsContainer.innerHTML = '';

    products.forEach((product) => {
        const productClone = productTemplate.content.cloneNode(true);

        productClone.querySelector('.card').setAttribute('data-id', product.id);
        productClone.querySelector('.card-img-top').src = product.image_path;
        productClone.querySelector('.card-title').textContent = product.name;
        productClone.querySelector('.card-description').textContent = product.description;
        productClone.querySelector('.card-price').textContent =
            `Prezzo: ${product.base_price}`;

        productClone.querySelector('.btn').addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        productsContainer.appendChild(productClone);
    });
}

async function refreshToken() {
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh_token: localStorage.getItem('refresh_token'),
        }),
    });

    if (!response.ok) {
        localStorage.clear();
        return null;
    }

    const data = await response.json();

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    return data.access_token;
}

async function fetchProductDetails(productId, retry = true) {
    const response = await fetch(`${API_URL}/products/${productId}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    });
    if (response.status === 401 && retry) {
        const newToken = await refreshToken();

        if (!newToken) {
            window.location.href = 'login.html';
            return;
        }

        return fetchProductDetails(productId, false);
    }

    if (!response.ok) {
        window.location.href = 'login.html';
        return;
    }

    const product = await response.json();

    const productContainer = document.getElementById('product-container');

    productContainer.querySelector('.card-img-top').src = product.image_path;
    productContainer.querySelector('.card-title').textContent = product.name;
    productContainer.querySelector('.card-description').textContent =
        product.description;
    productContainer.querySelector('.card-price').textContent =
        `Prezzo: ${product.base_price}`;
}