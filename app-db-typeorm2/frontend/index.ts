const api_url = 'http://localhost:3000/api'

interface Category {
    id: number
    name: string
    description: string
    slug: string
}

interface Product {
    id: number
    name: string
    description: string
    slug: string
    base_price: number
    sku: string
    is_active: boolean
    categories: Category[]
    images: ProductImage[]
}
interface ProductImage {
    id: number
    image_path: string
    alt_text: string
    sort_order: number
}

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
    const temp_category = document.getElementById('category-template') as HTMLTemplateElement;
    categories.forEach((category: Category) => {
        const clone = temp_category.content.cloneNode(true) as DocumentFragment;
        const name = clone.querySelector('#name') as HTMLElement;
        const description = clone.querySelector('#description') as HTMLElement;
        const slug = clone.querySelector('#slug') as HTMLElement;
        name.textContent = category.name;
        description.textContent = category.description;
        slug.textContent = category.slug;
        document.querySelector('#list-categories .card-body')?.appendChild(clone);
    });

    const products = await getProducts();
    const temp_product = document.getElementById('product-template') as HTMLTemplateElement;
    products.forEach((product: Product) => {
        const clone = temp_product.content.cloneNode(true) as DocumentFragment;
        const name = clone.querySelector('#name') as HTMLElement;
        const description = clone.querySelector('#description') as HTMLElement;
        const slug = clone.querySelector('#slug') as HTMLElement;
        const base_price = clone.querySelector('#base_price') as HTMLElement;
        const sku = clone.querySelector('#sku') as HTMLElement;
        const is_active = clone.querySelector('#is_active') as HTMLElement;
        const image = clone.querySelector('#image') as HTMLElement;
        name.textContent = product.name;
        description.textContent = product.description;
        slug.textContent = product.slug;
        base_price.textContent = product.base_price.toString();
        sku.textContent = product.sku;
        is_active.textContent = product.is_active.toString();
        const image_path = product.images.length > 0 ? product.images[0].image_path : '/images/no-image.jpg';
        (image as HTMLImageElement).src = image_path;
        document.querySelector('#list-products .card-body')?.appendChild(clone);
    });

}

main();