const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema ({
    name: { type: String, require: true },
    manufacturer: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number, require: true },
    dislikes: { type: Number, require: true },
    usersLiked: { type: String, require: teue },
    usersDisliked: { type: String, require: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);