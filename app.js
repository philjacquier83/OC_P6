const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://philjacquier:Mz%4034x7B@cluster0.rtjkshe.mongodb.net/P6?retryWrites=true&w=majority',
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(() => console.log('La connexion à MongoDB a réussi.'))
    .catch(() => console.log('La connexion à MongoDB a échoué.'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content, X-Requested-With, Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
}); 

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static('images'));

module.exports = app;