const crypto = require('crypto');

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator');

const transporter = nodeMailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    
    res.render('authentication/login', {
            path: '/login',
            pageTitle: 'Login | The Collection',
            errorMessage: message,
            oldInput: {
                email: "",
                password: ""
            },
            validationErrors: []
          });
    
  };

  exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render('authentication/signup', {
      path: '/signup',
      pageTitle: 'Signup | The Collection',
      errorMessage: message,
      oldInput: {
          name: "", 
          email: "", 
          password: "", 
          confirmPassword: ""
        },
      validationErrors: []
    });
  };

  exports.postLogin = (req, res, next) => {
      const email = req.body.email;
      const password = req.body.password;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).render('authentication/login', {
            path: '/login',
            pageTitle: 'Login | The Collection',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
          });
      }

        User.findOne({email: email})
    .then(user => {
        if (!user) {
            return res.status(422).render('authentication/login', {
                path: '/login',
                pageTitle: 'Login | The Collection',
                errorMessage: 'Invalid email or password.',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: [{param: 'email', param: 'password'}]
              });
        }
        bcrypt.compare(password, user.password).then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(() => {
                    res.redirect('/');
                });
            }
            return res.status(422).render('authentication/login', {
                path: '/login',
                pageTitle: 'Login | The Collection',
                errorMessage: 'Invalid email or password.',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: [{param: 'email', param: 'password'}]
              });
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        })
        
        
    })
    .catch(err => console.log(err))        
  }

    exports.postSignup = (req, res, next) => {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(422).render('authentication/signup', {
                path: '/signup',
                pageTitle: 'Signup | The Collection',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    name: name,
                    email: email, 
                    password: password, 
                    confirmPassword: req.body.confirmPassword 
                },
                validationErrors: errors.array()
            });
        }            
            bcrypt.hash(password, 12).then(hashedPassword =>{
                const user = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    cart: {items: []}
                });
                return user.save();
            }).then(result => {
                res.redirect('/login');
                /* return transporter.sendMail({
                    to: email,
                    from: 'shop@node.com',
                    subject: 'Signup completed!',
                    html: '<h1>You successfully signed up!</h1>'
                }); */
                }).catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
        });
    };

  exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        
        res.redirect('/');
    });      
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    
    res.render('authentication/reset-password', {
        path: '/reset-password',
        pageTitle: 'Reset Password | The Collection',
        errorMessage: message

    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32,(err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email}).then(user => {
            if (!user) {
                req.flash('error', 'No account found with that email.');
                return res.redirect('/reset-password');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        }).then(result => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'shop-help@node.com',
                subject: 'Signup Reset',
                html: `
                    <h1>Hello,</h1>
                    <p>You requested a password reset.</p>
                    <p>Click <a href="http://localhost:3000/reset-password/${token}">this link</a> to set a new password.</p>
                `
            });
        }).catch(err => {
            const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        } 
        );
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}).then(user =>{
        let message = req.flash('error');
    
        if (message.length > 0) {
            message = message[0]
        } else {
            message = null;
        }
    
        res.render('authentication/new-password', {
            path: '/new-password',
            pageTitle: 'Set a New Password | The Collection',
            errorMessage: message, 
            userId: user._id,
            passwordToken: token

        })
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
    
}

exports.postNewPasswrod = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({resetToken: passwordToken, resetTokenExpiration: {sgt: Date.now(), _id: userId}}).then(resetUser => {
        return bcrypt.hash(newPassword, 12);
    }).then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    }).then(result => {
        res.redirect('/login');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}
