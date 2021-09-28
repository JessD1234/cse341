const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Prodcut',
        path: '/admin/add-product',
        editing: false
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, price, description);
    product.save();
   console.log(product);
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
       return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Prodcut',
            path: '/admin/edit-product', 
            editing: editMode,
            product: product
        });
    });
    
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(productId, updatedTitle, updatedImageUrl, updatedPrice, updatedDesc);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products');
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