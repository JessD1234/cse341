const express = require('express');

const routeFinder = require('../util/path');
const path = require('path');

const router = express.Router();

const products = [];
const users = [];

router.get('/add-product', (req, res, next) => {
    //res.sendFile(path.join(routeFinder, 'views', 'add-product.html'));
    res.render('add-product', {pageTitle: 'Add Product', path: '/admin/add-product'});
});

router.post('/add-product', (req, res, next) => {
    products.push({title: req.body.title});
    console.log(req.body);
    console.log(products);
    console.log(products.title);
    res.redirect('/');
});

router.get('/add-users', (req, res, next) => {
    res.render('add-users', {pageTitle: 'Add User', path: '/admin/add-users'})
   //res.sendFile(path.join(routeFinder, 'views', 'users.html'));
});

router.post('/add-users', (req, res, next) => {
    users.push({name: req.body.name});
  console.log(users);
    res.redirect('/admin/display-users');
});

router.get('/display-users', (req, res, next) => {
    res.render('display-users', {users: users, pageTitle: 'Users', path: '/admin/display-users'})
   //res.sendFile(path.join(routeFinder, 'views', 'users.html'));
});

exports.routes = router;
exports.products = products;