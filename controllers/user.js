// CONTROLLER UTILISATEUR - contient la logique métier des routes utilisateur

// importation des packages bcrypt, jwt, email-validator, password-validator et mongo-sanitize
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const sanitize = require('mongo-sanitize');

// importation du modèle utilisateur
const User = require('../models/User');


// création d'un modèle de mot de passe
const passwordSchema = new passwordValidator();

// conditions requises pour le mot de passe
passwordSchema
    .is().min(8) // longueur minimum
    .is().max(60) // longueur maximum
    .has().uppercase()  // contient au moins une majuscule
    .has().lowercase() // contient au moins une minuscule
    .has().digits() // contient au moins un chiffre
    .has().not().spaces() // ne contient pas d'espace


// exportation de la fonction qui va enregistrer un nouvel utilisateur
exports.signup = (req, res, next) => {

    // si l'adresse mail ou le mot de passe est invalide + sanitize inputs contre injections
    if (!emailValidator.validate(sanitize(req.body.email)) || !passwordSchema.validate(sanitize(req.body.password))) {
        return res.status(401).json({message: 'Veuillez vérifier l adresse mail et le mot de passe. Le mot de passe doit contenir entre ' +
                '8 et 60 caractères sans espace, et inclure au moins une majuscule, une minuscule et un chiffre'})

    // si l'adresse mail et le mot de passe sont valides + sanitize inputs contre injections
    } else if(emailValidator.validate(sanitize(req.body.email)) && passwordSchema.validate(sanitize(req.body.password))) {
        bcrypt.hash(req.body.password, 10) // hachage du mot de passe

            // création et enregistrement d'un nouvel utilisateur dans la bdd avec email et mot de passe crypté
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                    .catch(error => res.status(400).json({error}));
            })
            .catch(error => res.status(500).json({error}));
    }
};


// exportation de la fonction qui va connecter un utilisateur déjà enregistré
exports.login = (req, res, next) => {

    // vérification de la présence de l'utilisateur dans la bdd + sanitize inputs contre injections
    User.findOne({email: sanitize(req.body.email)})
        .then(user => {
            if (!user) {
                return res.status(401).json({message: 'Utilisateur non trouvé !'})
            }
            return bcrypt.compare(sanitize(req.body.password), user.password) // si utilisateur trouvé, comparaison mdp et hash
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({message: 'Mot de passe incorrect !'})
                    }
                    res.status(200).json({ // si mdp ok, encodage d'un nouveau token
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                })
        })
        .catch(error => res.status(500).json({error}));
};
