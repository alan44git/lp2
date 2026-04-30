const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const productsFile = path.join(__dirname, 'products.json');
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

app.get('/api/products', (req, res) => {
  fs.readFile(productsFile, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to read products file' });
      return;
    }

    const products = JSON.parse(data);
    res.json(products);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
