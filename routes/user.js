// ROUTEUR UTILISATEUR - contient la logique de routing utilisateur

// importation d'express et du controllers utilisateur
const express = require('express');
const userCtrl = require('../controllers/user');


// création d'un routeur express
const router = express.Router();


// application des fonctions de gestion des utilisateurs aux différentes routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


// exportation du router
module.exports = router;
