const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Prodcut',
        path: '/admin/add-product'
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, price, description);
    product.save();
   console.log(product);
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
       return res.redirect('/');
    }
    res.render('admin/edit-product', {
        pageTitle: 'Edit Prodcut',
        path: '/admin/edit-product', 
        editing: editMode
    })
};

const users = [];

exports.getAddUsers = (req, res, next) => {
    res.render('admin/add-users', {pageTitle: 'Add User', path: '/admin/add-users'})
   //res.sendFile(path.join(routeFinder, 'views', 'users.html'));
};

exports.postAddUsers = (req, res, next) => {
    users.push({name: req.body.name});
  console.log(users);
    res.redirect('/admin/display-users');
};

exports.getDisplayUsers = (req, res, next) => {
    res.render('admin/display-users', {users: users, pageTitle: 'Users', path: '/admin/display-users'})
   //res.sendFile(path.join(routeFinder, 'views', 'users.html'));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // console.log(products);
         res.render('admin/products', {
             prods: products, 
             pageTitle: 'Admin Products', 
             path: '/admin/products'});
     });
}