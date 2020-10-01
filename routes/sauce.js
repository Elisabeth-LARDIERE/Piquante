// ROUTEUR SAUCE - contient la logique de routing sauce

//importation d'express, du controller sauce et des middleware auth et multer-config
const express = require('express');
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// création d'un routeur express
const router = express.Router();


// application des fonctions de gestion des sauces aux différentes routes
// application du middleware auth pour protéger les routes de l'application
// application du middleware multer pour les routes concernées par l'enregistrement des fichiers images
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);


// exportation du routeur
module.exports = router;
