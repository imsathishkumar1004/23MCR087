const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { getAccessToken, renewToken, accessToken } = require('./auth');

const app = express();
app.use(cors());
app.use(cookieParser());

app.get('/:company/categories/:category/products', async (req, res) => {
  const token = await renewToken();
  const company = req.params.company;
  const category = req.params.category;
  const top = parseInt(req.query.top);
  const minPrice = parseInt(req.query.minPrice);
  const maxPrice = parseInt(req.query.maxPrice);
  const sort = req.query.sort;
  const order = req.query.order;

  const apiUrl = `http://20.244.56.144/test/companies/${company}/categories/${category}/products`;
  const params = {
    top,
    minPrice,
    maxPrice
  };

  if (sort) {
    params.sort = sort;
  }

  if (order) {
    params.order = order;
  }

  axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  })
  .then(response => {
    const products = response.data;
    let sortedProducts;

    if (sort === 'price') {
      if (order === 'asc') {
        sortedProducts = products.sort((a, b) => a.price - b.price);
      } else if (order === 'desc') {
        sortedProducts = products.sort((a, b) => b.price - a.price);
      }
    } else if (sort === 'rating') {
      if (order === 'asc') {
        sortedProducts = products.sort((a, b) => a.rating - b.rating);
      } else if (order === 'desc') {
        sortedProducts = products.sort((a, b) => b.rating - a.rating);
      }
    } else if (sort === 'discount') {
      if (order === 'asc') {
        sortedProducts = products.sort((a, b) => a.discount - b.discount);
      } else if (order === 'desc') {
        sortedProducts = products.sort((a, b) => b.discount - a.discount);
      }
    } else {
      sortedProducts = products;
    }

    const topProducts = sortedProducts.slice(0, top);

    topProducts.forEach(product => {
      product.id = `${company}-${category}-${product.productId}`;
    });

    res.json(topProducts);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  });
});


app.get('/:company/categories/:category/products/:productId', async (req, res) => {
  const token = await renewToken();

  const company = req.params.company;
  const category = req.params.category;
  const productId = req.params.productId;

  const apiUrl = `http://20.244.56.144/test/companies/${company}/categories/${category}/products/${productId}`;

  axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).json({ error: 'Product not found' });
  });
});


const port = 3001;
app.listen(port, async () => {
  console.log(`Server started on port ${port}`);
  await getAccessToken();
});