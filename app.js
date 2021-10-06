const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const path = require('path');

const PORT = process.env.PORT || 3000

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('615e15c2512cc74f51011287')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://JESSICA:ObGPEzU0SpCl1fDD@cluster0.4qool.mongodb.net/shop?retryWrites=true&w=majority').then(result => {
    User.findOne().then(user => {
        if (!user){
            const user = new User({
                name: 'Jessica',
                email: 'duckworthje1@yahoo.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })
    app.listen(PORT);
}).catch(err => {
    console.log(err);
});