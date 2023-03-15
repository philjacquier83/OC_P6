const Sauce = require('../models/sauce');


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
    .then(sauce => {
        res.status(200).json(sauce);
    })
    .catch(error => res.status(404).json({ error }));
};


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => {
        res.status(200).json(sauces);
    })
    .catch(error => res.status(404).json({ error }));
};


exports.modifySauce = (req, res, next) => {
    // findOne la sauce => à vérifier
    const sauce = new Sauce({
        _id: req.params.id,
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked
    });
    Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
        res.status(201).json({ message: 'Sauce modifiée avec succès.'});
    })
    .catch( error => res.status(500).json({ error }));
};


exports.createSauce = (req, res, next) => {
    const sauce = new Sauce({
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => {
        res.status(201).json({ message: 'Votre sauce a été correctement créée.'})
    })
    .catch( error => res.status(500).json({ error }));
};


exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
        res.status(200).json({ message: 'Votre sauce a bien été supprimée.'})
    })
    .catch(error => res.status(500).json({ error }));
};