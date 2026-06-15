"use strict";
const api_url = 'http://localhost:3000/api';
async function getCategories() {
    const response = await fetch(`${api_url}/categories`);
    const data = await response.json();
    return data;
}
async function getProducts() {
    const response = await fetch(`${api_url}/products`);
    const data = await response.json();
    return data;
}
async function main() {
    const categories = await getCategories();
    const temp_category = document.getElementById('category-template');
    categories.forEach((category) => {
        const clone = temp_category.content.cloneNode(true);
        const name = clone.querySelector('#name');
        const description = clone.querySelector('#description');
        const slug = clone.querySelector('#slug');
        name.textContent = category.name;
        description.textContent = category.description;
        slug.textContent = category.slug;
        document.querySelector('#list-categories .card-body')?.appendChild(clone);
    });
    const products = await getProducts();
    const temp_product = document.getElementById('product-template');
    products.forEach((product) => {
        const clone = temp_product.content.cloneNode(true);
        const name = clone.querySelector('#name');
        const description = clone.querySelector('#description');
        const slug = clone.querySelector('#slug');
        const base_price = clone.querySelector('#base_price');
        const sku = clone.querySelector('#sku');
        const is_active = clone.querySelector('#is_active');
        const image = clone.querySelector('#image');
        name.textContent = product.name;
        description.textContent = product.description;
        slug.textContent = product.slug;
        base_price.textContent = product.base_price.toString();
        sku.textContent = product.sku;
        is_active.textContent = product.is_active.toString();
        const image_path = product.images.length > 0 ? product.images[0].image_path : '/images/no-image.jpg';
        image.src = image_path;
        document.querySelector('#list-products .card-body')?.appendChild(clone);
    });
}
main();
