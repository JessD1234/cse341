const express = require('express');

const authenticationController = require('../controllers/authentication');
const {check, body} = require('express-validator');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authenticationController.getLogin);

router.get('/signup', authenticationController.getSignup);

router.post('/login', body('email').isEmail().withMessage('Please enter a valid email address.').trim(), body('password', 'That password is incorrect. It needs to be at least 5 characters.').isLength({min: 5}).trim(), authenticationController.postLogin);

router.post('/signup', check('email').isEmail().withMessage('Please enter a valid email.').custom((value, {req}) => {
    return User.findOne({email: req.body.email}).then(userDoc => {
        if (userDoc) {
            return Promise.reject('The email you entered already exists in our system. Please enter a different one, or try logging in.');
        }
    });
}), body('password', 'Please check the password you entered. It must be at least 5 characters.').isLength({min: 5}), body('confirmPassword').custom((value, {req}) => {
    if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
    }
    return true;
}), authenticationController.postSignup);

router.post('/logout', authenticationController.postLogout);

router.get('/reset-password', authenticationController.getReset);

router.post('/reset-password', authenticationController.postReset);

router.get('/reset-password:token', authenticationController.getNewPassword);

router.post('/new-password', authenticationController.postNewPasswrod);

module.exports = router;