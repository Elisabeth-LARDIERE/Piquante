// APPLICATION EXPRESS

// importation du framework express et des package body-parser, mongoose et path
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// importation des routeurs sauce et utilisateur
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


// création de l'application express
const app = express();

// connexion au cluster MongoDB
mongoose.connect('mongodb+srv://spadassine:uJ1hL9GFJ00lkjNr@piquante.xampq.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// ajout de headers pour toutes les requêtes afin d'autoriser n'importe quel utilisateur à accéder à l'application
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// transformation du corps des requêtes en objets javascript utilisables
app.use(bodyParser.json());

// gestion de la ressource images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// enregistrement des routeurs sauce et utilisateur pour n'importe quelle requête effectuée vers /api/sauces et /api/auth
app.use ('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// exportation de l'application
module.exports = app;
