const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', adminController.getProducts);

// // /admin-/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); 

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

/* router.get('/add-users', adminController.getAddUsers);

router.post('/add-users', adminController.postAddUsers);

router.get('/display-users', adminController.getDisplayUsers);
 */
exports.routes = router;
