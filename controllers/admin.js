const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

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
    const product = new Product(title, price, description, imageUrl, null, req.user._id);

    product.save().then(result => {
        console.log('Product created');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
       return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId).then(product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Prodcut',
            path: '/admin/edit-product', 
            editing: editMode,
            product: product
        });
    }).catch(err => {
        console.log(err);
    });
    
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description; 
    const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, new ObjectId(productId)); 
    product.save().then(result => {
        console.log('Product updated!');
        res.redirect('/admin/products');
   })    
};


exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId).then(() => {
        console.log("Product destroyed.");
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
    
};

/*
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
*/
exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        // console.log(products);
         res.render('admin/products', {
             prods: products, 
             pageTitle: 'Admin Products', 
             path: '/admin/products'});
     });
} 