const mongoose = require('mongoose');

// rajouter validator sur name (au moins 2 caractères), description

const sauceSchema = mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    manufacturer: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number, require: true },
    dislikes: { type: Number, require: true },
    usersLiked: { type: Array, default: [] },
    usersDisliked: { type: Array, default: [] }
});

module.exports = mongoose.model('Sauce', sauceSchema);