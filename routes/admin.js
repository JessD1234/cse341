const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', adminController.getProducts);

// /admin-/add-product => GET
router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct); 

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

/* router.get('/add-users', adminController.getAddUsers);

router.post('/add-users', adminController.postAddUsers);

router.get('/display-users', adminController.getDisplayUsers);
 */
exports.routes = router;
