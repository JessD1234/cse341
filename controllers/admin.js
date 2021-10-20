const mongodb = require('mongodb');
const Product = require('../models/product');
const { validationResult } = require('express-validator')

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/edit-product', {
        pageTitle: 'Add Prodcut',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const authorName = req.body.authorName;
    const description = req.body.description;
    const errors = validationResult(req);
    console.log(authorName);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product | The Collection',
            path: '/admin/add-product', 
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description,
                authorName: authorName
            },
            errorMessage: errors.array()[0].msg,
            isAuthenticated: req.session.isLoggedIn,
            validationErrors: errors.array()
        });
    }

    const product = new Product({
        title: title, 
        price: price, 
        imageUrl: imageUrl, 
        description: description, 
        userId: req.user,
        authorName: authorName
    });

    product.save().then(result => {
        console.log('Product created');
        res.redirect('/admin/products');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        
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
            pageTitle: 'Edit Prodcut | The Collection',
            path: '/admin/edit-product', 
            editing: editMode,
            product: product,
            isAuthenticated: req.session.isLoggedIn,
            hasError: false,
            errorMessage: null,
            validationErrors: []
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description; 
    const updatedAuthorName = req.body.authorName;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Prodcut | The Collection',
            path: '/admin/edit-product', 
            editing: true,
            hasError: true,
            product: {
                _id: productId,
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDesc,
                authorName: updatedAuthorName
            },
            errorMessage: errors.array()[0].msg,
            isAuthenticated: req.session.isLoggedIn,
            validationErrors: errors.array()
        });
    }

    Product.findById(productId).then(product =>{
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        product.authorName = updatedAuthorName;
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
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
};

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id}).then(products => {
        console.log(products);
         res.render('admin/products', {
             prods: products, 
             pageTitle: 'Admin Products | The Collection', 
             path: '/admin/products',
             isAuthenticated: req.session.isLoggedIn
            });
             
     });
} 