// APPLICATION EXPRESS

// importation du framework express
const express = require('express');

// création de l'application express
const app = express();

// ajout de headers pour toutes les requêtes afin d'autoriser n'importe quel utilisateur à accéder à l'application
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// exportation de l'application
module.exports = app;
