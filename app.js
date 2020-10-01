// APPLICATION EXPRESS

// importation du framework express et des package body-parser, mongoose path et helmet
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

// importation et configuration du module dotenv
require('dotenv').config()

// importation des routeurs sauce et utilisateur
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


// création de l'application express
const app = express();


// connexion au cluster MongoDB - masquage des données de connexion avec dotenv
mongoose.connect('mongodb+srv://'+ process.env.DB_USER2 +':'+ process.env.DB_PASSWORD2 +'@piquante.xampq.mongodb.net/<dbname>?retryWrites=true&w=majority',
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

// activation de la protection helmet : configuration des en-têtes HTTP de manière appropriée
app.use(helmet());

// enregistrement des routeurs sauce et utilisateur pour n'importe quelle requête effectuée vers /api/sauces et /api/auth
app.use ('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// exportation de l'application
module.exports = app;
