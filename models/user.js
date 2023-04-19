const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: 'L\'email doit être de type email : exemple@exemple.fr',
    }),
];

const passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^[A-Za-z0-9 -àùéèöüïë@%*+$&.]{2,}$/,
        message: 'Le mot de passe doit comporter uniquement des caractères alphanumériques',
    }),
];

const userSchema = mongoose.Schema({
    email: { type: String, require: true, validate: emailValidator, unique: true },
    password: { type: String, require: true, validate: passwordValidator }
});

module.exports = mongoose.model('User', userSchema);