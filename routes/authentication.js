const express = require('express');

const authenticationController = require('../controllers/authentication');
const {check} = require('express-validator');

const router = express.Router();

router.get('/login', authenticationController.getLogin);

router.get('/signup', authenticationController.getSignup);

router.post('/login', authenticationController.postLogin);

router.post('/signup', check('email').isEmail().withMessage('Please enter a valid email.'), authenticationController.postSignup);

router.post('/logout', authenticationController.postLogout);

router.get('/reset-password', authenticationController.getReset);

router.post('/reset-password', authenticationController.postReset);

router.get('/reset-password:token', authenticationController.getNewPassword);

router.post('/new-password', authenticationController.postNewPasswrod);

module.exports = router;