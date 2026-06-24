console.log('Hello, World!');
fetch('http://localhost:3000/api/products', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item:any) => {
      const template = document.getElementById('item-template') as HTMLTemplateElement;
      const clone = template.content.cloneNode(true) as HTMLElement;
      const itemElement = clone.querySelector('.item') as HTMLElement;
      itemElement.querySelector('.item-name')!.textContent = item.name;
      itemElement.querySelector('.item-description')!.textContent = item.description;
      itemElement.querySelector('.item-base_price')!.textContent = item.base_price;
      document.getElementById('items-container')!.appendChild(clone);
    });
  })
  .catch((error) => {
    console.error(error);
  });