// CONTROLLER SAUCE - contient la logique métier des routes sauce

// importation des packages fs et mongo-sanitize
const fs = require('fs');
const sanitize = require('mongo-sanitize');

// importation du modèle sauce
const Sauce = require('../models/Sauce');


// exportation de la fonction qui va créer une sauce (gère la route POST)
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(sanitize(req.body.sauce)); // récupération des infos de la sauce qu'on parse en objet + sanitize des inputs
    delete sauceObject._id;
    const sauce = new Sauce({ // création de la nouvelle sauce avec infos de la sauce + image
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save() // enregistrement de la nouvelle sauce dans la bdd
        .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({error}))
};


// exportation de la fonction qui va modifier une sauce (gère la route PUT)
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // si modification de l'image
        {
            ...JSON.parse(sanitize(req.body.sauce)), // récupération des infos de la sauce qu'on parse en objet + sanitize des inputs
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// modification de l'image
        }
        : { // si pas de modification de l'image
            ...(sanitize(req.body)) // récupération du corps de la requête + sanitize des inputs
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


//exportation de la fonction qui va gérer les likes et les dislikes
exports.likeOrDislikeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    if (like === 1) { // l'utilisateur like la sauce
        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: userId}}) // incrémentation des likes, sauvegarde de l'utilisateur dans usersLiked
            .then(() => res.status(200).json({message: 'L\'utilisateur like la sauce !'}))
            .catch(error => res.status(400).json({error}));
    } else if (like === -1) { // l'utilisateur dislike la sauce
        Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: userId}}) // incrémentation des dislikes, sauvegarde de l'utilisateur dans usersDisliked
            .then(() => res.status(200).json({message: 'L\'utilisateur dislike la sauce !'}))
            .catch(error => res.status(400).json({error}));
    } else if (like === 0) { // l'utilisateur retire son like ou son dislike
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) { // s'il retire son like
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: userId}}) // décrémentation des likes, suppression de l'utilisateur dans usersLiked
                        .then(() => res.status(200).json({message: 'L\'utilisateur ne like plus la sauce !'}))
                        .catch(error => res.status(400).json({error}));
                } else if (sauce.usersDisliked.includes(userId)) { // s'il retire son dislike
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}}) // décrémentation des dislikes, suppression de l'utilisateur dans usersDisliked
                        .then(() => res.status(200).json({message: 'L\'utilisateur ne dislike plus la sauce !'}))
                        .catch(error => res.status(400).json({error}));
                }
            })
            .catch(error => res.status(404).json({error}));
    }
}

