// CONTROLLER SAUCE - contient la logique métier des routes sauce

// importation du package fs
const fs = require('fs');

// importation du modèle sauce
const Sauce = require('../models/Sauce');


// exportation de la fonction qui va créer une sauce (gère la route POST)
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // récupération des infos de la sauce qu'on parse en objet
    delete sauceObject._id;
    const sauce = new Sauce({ // création de la nouvelle sauce avec infos de la sauce + image
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save() // enregistrement de la nouvelle sauce dans la bdd
        .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({error}))
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    sauceObject.usersLiked = [];
    sauceObject.usersDisliked = [];
};


// exportation de la fonction qui va modifier une sauce (gère la route PUT)
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // si modification de l'image
        {
            ...JSON.parse(req.body.sauce), // récupération des infos de la sauce qu'on parse en objet
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// modification de l'image
        }
        : { // si pas de modification de l'image
            ...req.body // récupération du corps de la requête
        };

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}) // mise à jour de la sauce
        .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({error}));
};


// exportation de la fonction qui va supprimer une sauce (gère la route DELETE)
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => { // suppression du fichier image correspondant à l'objet supprimé
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
};


// exportation de la fonction qui va récupérer toutes les sauces (gère la route GET)
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};


// exportation de la fonction qui va récupérer une seule sauce (gère la route GET)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};
