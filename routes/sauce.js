// ROUTEUR SAUCE - contient la logique de routing sauce

//importation d'express et du controller sauce
const express = require('express');
const sauceCtrl = require('../controllers/sauce');


// création d'un routeur express
const router = express.Router();


// application des fonctions de gestion des sauces aux différentes routes

router.post('/', sauceCtrl.createSauce);

router.put('/:id', sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);

router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSauce);


// exportation du routeur
module.exports = router;
