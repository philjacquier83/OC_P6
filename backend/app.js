const express = require('express');
const mongoose = require('mongoose');
const app = express();

// on importe les routes Sauces et Users
const sauceRoutes = ('./routes/sauce');
const userRoutes = ('./routes/user');


// on ajoute express.json pour lire facilement dans le corps de la requête
app.use(express.json());

// connexion à la base MongoDB
mongoose.connect('mongodb+srv://philjacquier:Gza4034x7C@cluset0-pme76.mongodb.net/P6?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// pb CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Rquested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Methods','POST, GET, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// on enregistre les routeurs pour les demandes effectuées
// route Sauces pour toutes demandes faites sur /api/sauces
app.use('/api/sauces', sauceRoutes);

// route Auth pour toute demande d'authentification (signup, login)
app.use('/api/auth', userRoutes);

module.exports = app;