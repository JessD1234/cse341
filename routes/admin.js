const express = require('express');
const {body} = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', adminController.getProducts);

// // /admin-/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', body('title').isLength({min: 3}).trim(), body('imageUrl').isURL(), body('price').isFloat(), body('description').trim().isLength({min: 5, max: 400}), isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); 

router.post('/edit-product', body('title').isLength({min: 3}).trim(), body('imageUrl').isURL(), body('price').isFloat(), body('description').trim().isLength({min: 5, max: 400}), isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

exports.routes = router;
