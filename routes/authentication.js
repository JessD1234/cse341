const express = require('express');

const authenticationController = require('../controllers/authentication');

const router = express.Router();

router.get('/login', authenticationController.getLogin);

router.get('/signup', authenticationController.getSignup);

router.post('/login', authenticationController.postLogin);

router.post('/signup', authenticationController.postSignup);

router.post('/logout', authenticationController.postLogout);

module.exports = router;