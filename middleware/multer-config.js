// MIDDLEWARE DE CONFIGURATION DE MULTER POUR LA GESTION DES FICHIERS ENTRANTS

// importation du package multer
const multer = require('multer');


// dictionnaire de mime_types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


// création d'un objet de configuration pour multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => { // dit à multer d'enregistrer les fichiers dans le dossier images
        callback(null, 'images');
    },
    filename: (req, file, callback) => { // dit à multer quel nom de fichier utiliser
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});


// exportation du middleware multer configuré
module.exports = multer({ storage: storage }).single('image');
