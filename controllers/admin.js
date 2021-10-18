const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/edit-product', {
        pageTitle: 'Add Prodcut',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title, 
        price: price, 
        imageUrl: imageUrl, 
        description: description, 
        userId: req.user
    });

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
            product: product,
            isAuthenticated: req.session.isLoggedIn
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
    Product.findById(productId).then(product =>{
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save().then(result => {
            console.log('Product updated!');
            res.redirect('/admin/products');
        })
   }).catch(err => console.log(err));    
};


exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteOne({_id: productId, userId: req.user._id}).then(() => {
        console.log("Product destroyed.");
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
    
};

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id}).then(products => {
        console.log(products);
         res.render('admin/products', {
             prods: products, 
             pageTitle: 'Admin Products', 
             path: '/admin/products',
             isAuthenticated: req.session.isLoggedIn
            });
             
     });
} 