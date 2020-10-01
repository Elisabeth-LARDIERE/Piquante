// MODELE D'UTILISATEUR

// importation des packages mongoose et mongoose-unique validator
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// création du schéma de données qui contient les caractéristiques pour chaque utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true}, // valeur unique : empêche que deux utilisateurs se servent de la même adresse mail
    password: {type: String, required: true},
});

// empêche que deux utilisateurs se servent de la même adresse mail
userSchema.plugin(uniqueValidator);


// exportation du modèle d'utilisateur
module.exports = mongoose.model('User', userSchema);
