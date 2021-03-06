const express = require('express');
const router = express.Router();
const products = require('../products');
// const pino = require('pino');
// const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });

//Get all products from shopify
router.get('/:projectId', async (req, res) => {
  let productData = await products.getProducts(req.params.projectId).catch((err) => {
    logger.error('Products information could not be recived when getting all product', err);
  });
  res.send(productData);
});

//Get one product from shopify
router.get('/:projectId/:id', async (req, res) => {
  let productData = await products.getProduct(req.params.projectId, req.params.id).catch((err) => {
    logger.error('Product information could not be recived when getting one product', err);
  });
  res.send(productData);
});

//Delete all products from shopify
router.get('/deleteAll/:projectId', async (req, res) => {
  let productData = await products.deleteAllProducts(req.params.projectId).catch((err) => {
    logger.error('Product information could not be recived when deleting all products', err);
  });
  res.send(productData);
});

//Delete one product from shopify
router.get('/delete/:projectId/:id', async (req, res) => {
  let productData = await products.deleteProduct(req.params.projectId, req.params.id).catch((err) => {
    logger.error('Product information could not be recived from when deleting a product', err);
  });
  res.send(productData);
});

//add a product to shopify
router.post('/add/:projectId', async (req, res) => {
  let productData = await products
    .addProduct(req.params.projectId, req.body.title, req.body.vendor, req.body.product_type, req.body.image_url)
    .catch((err) => {
      logger.error('Product information could not be recived when adding a product', err);
    });
  res.send(productData);
});

module.exports = router;
