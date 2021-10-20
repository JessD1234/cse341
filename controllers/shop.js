const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
    Product.find().then(products => {
      console.log(products);
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products | The Collection', 
            path: '/products',
            isAuthenticated: req.session.isLoggedIn});
    }).catch(err => {
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
  };

  exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    }).catch(err =>{
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
  }

  exports.getIndex = (req, res, next) => {
    /* Product.findOne({$query: {}, $orderby: {$natural : -1}}).then(product => {
      console.log('This is the result of the above findOne query:');
    console.log(product);
    }); */
    
    
    Product.find({}).sort({_id: -1}).limit(1).then(product => {
      console.log('This is the result of the query:')
      console.log(product);
       res.render('shop/index', {
           product: product[0], 
           pageTitle: 'Home | The Collection', 
           path: '/'
          });
   }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
   });
  };

  exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId').then(user => {
        console.log(user.cart.items);
        const products = user.cart.items;
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart | The Collection',
            products: products,
            isAuthenticated: req.session.isLoggedIn
      });
    }).catch(err => {
      console.log(err);
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
  };

  exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    
    Product.findById(productId).then(product => {
      return req.user.addToCart(product);
    }).then(result => {
      console.log(result);
      res.redirect('/cart');
    });
  };

  exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeFromCart(productId).then(result => {
      res.redirect('/cart');
    }).catch(err => {
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
  };

  exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId').then(user => {
      console.log(user.cart.items);
      const products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc}};
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      order.save();
    }).then(result => {
      return req.user.clearCart();
    }).then(result => {
      res.redirect('/orders');
    }).catch(err => {
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
  }

  exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id}).then(orders => {
      res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders | The Collection',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
          });
    }).catch(err => {
      const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
  };

  exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout | The Collection',
      isAuthenticated: req.session.isLoggedIn
    })
  }

