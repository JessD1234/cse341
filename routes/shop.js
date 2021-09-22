const express = require('express');

const path = require('path');

const routeFinder = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  console.log(products);
   // res.sendFile(path.join(routeFinder, 'views', 'shop.html'));
   res.render('shop', {
       prods: products, 
       pageTitle: 'Shop', 
       path: '/',
       hasProducts: products.length > 0,
       activeShop: true,
       productCSS: true});
});

module.exports = router;