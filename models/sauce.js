const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[A-Za-z0-9 -àùéèöüïë]{2,}$/,
        message: 'Le nom doit comporter uniquement des caractères alphanumériques',
    }),
];

const manufacturerValidator = [
    validate({
        validator: 'matches',
        arguments: /^[A-Za-z0-9 -àùéèöüïë]{2,}$/,
        message: 'Le manufactureur doit comporter uniquement des caractères alphanumériques',
    }),
];

const descriptionValidator = [
    validate({
        validator: 'matches',
        arguments: /^[A-Za-z0-9 -àùéèöüïë]{2,}$/,
        message: 'La description doit comporter uniquement des caractères alphanumériques',
    }),
];

const mainPepperValidator = [
    validate({
        validator: 'matches',
        arguments: /^[A-Za-z0-9 -àùéèöüïë]{2,}$/,
        message: 'Le champ Main Pepper doit comporter uniquement des caractères alphanumériques',
    }),
];

const sauceSchema = mongoose.Schema({
    userId: { type: String, require: true },
    name: { type: String, require: true, validate: nameValidator },
    manufacturer: { type: String, require: true, validate: manufacturerValidator },
    description: { type: String, require: true, validate: descriptionValidator },
    mainPepper: { type: String, require: true, validate: mainPepperValidator },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number, require: true, default: 0 },
    dislikes: { type: Number, require: true, default: 0 },
    usersLiked: { type: Array, default: [] },
    usersDisliked: { type: Array, default: [] }
});

module.exports = mongoose.model('Sauce', sauceSchema);