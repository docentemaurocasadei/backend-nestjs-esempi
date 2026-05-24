type Product = {
  name: string;
  description?: string;
  price?: number;
};
const loadBtnFetch = document.getElementById("loadBtnFetch");
const loadBtnAsyncAwait = document.getElementById("loadBtnAsyncAwait");
const message = document.getElementById("message");
if (loadBtnFetch) {
  loadBtnFetch.addEventListener("click", function () {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data: Product[]) => {
        loadProductsWithError(data);
      })
      .catch((error) => {
        if (message) {
          message.textContent = "Errore nel caricamento dei prodotti";
        }
        console.error("Errore:", error);
      });
  });
}

// Versione con async/await
const button = document.getElementById("loadBtnAsyncAwait");

if (button) {
  button.addEventListener("click", loadProducts);
}

async function loadProducts() {
  const message = document.getElementById("message");
  const productsList = document.getElementById("productsList");
  const template = document.getElementById("productCardTemplate");

  if (message) {
    message.textContent = "Caricamento prodotti...";
  }
  if (productsList) {
    productsList.innerHTML = "";
  }

  try {
    const response = await fetch("http://localhost:3000/products");

    if (!response.ok) {
      throw new Error("Errore HTTP " + response.status);
    }

    const products: Product[] = await response.json();

    loadProductsWithError(products);

    if (message) {
      message.textContent = "Prodotti caricati: " + products.length;
    }
  } catch (error) {
    if (message) {
      message.textContent = "Errore nel caricamento dei prodotti";
    }
    console.error("Errore:", error);
  }
}
function loadProductsWithError(data: Product[]) {
  const message = document.getElementById("message");
  const productsList = document.getElementById("productsList");
  const template = document.getElementById(
    "productCardTemplate",
  ) as HTMLTemplateElement | null;
  if (message) {
    message.textContent = "Caricamento prodotti...";
  }
  if (productsList) {
    productsList.innerHTML = "";
  }
  try {
    data.forEach((product) => {
      if (template === null) {
        throw new Error("Template non trovato");
      }
      if (productsList === null) {
        throw new Error("Elemento productsList non trovato");
      }
      const card = template.content.cloneNode(true) as HTMLElement;
      card.querySelector(".product-name")!.textContent = product.name;
      card.querySelector(".product-description")!.textContent =
        product.description ?? "Nessuna descrizione disponibile";
      card.querySelector(".product-price")!.textContent = product.price
        ? "€ " + product.price
        : "Prezzo non disponibile";
      productsList.appendChild(card);
    });
    if (message) {
      message.textContent = "Prodotti caricati: " + data.length;
    }
  } catch (error) {
    if (message) {
      message.textContent = "Errore nel caricamento dei prodotti";
    }
    console.error("Errore:", error);
  }
}
