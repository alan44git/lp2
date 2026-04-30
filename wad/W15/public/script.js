const productList = document.getElementById('productList');

fetch('/api/products')
  .then(function(response) {
    return response.json();
  })
  .then(function(products) {
    productList.innerHTML = '';

    products.forEach(function(product) {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';

      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <span class="image-text">Image not available</span>
        <h3>${product.name}</h3>
        <p>Price: Rs. ${product.price}</p>
      `;

      productList.appendChild(productDiv);
    });
  })
  .catch(function(error) {
    productList.innerHTML = '<p>Unable to load products.</p>';
    console.log(error);
  });
