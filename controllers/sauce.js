const Sauce = require('../models/sauce');
const fs = require('fs');

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
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
    delete sauceObject._userId;

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if(sauce.userId != req.auth.userId) {
                console.log('ko');
                res.status(401).json({ message: 'Vous n\'êtes pas autorisé à supprimer cet objet'});
            } else {
                console.log('ok');
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès.'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch( error => res.status(400).json({ error }));
    
};


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject);
    
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => {
        res.status(201).json({ message: 'Votre sauce a été correctement créée.'})
    })
    .catch( error => {
        console.log (error);
        res.status(500).json({ error });
    })
};


exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
        res.status(200).json({ message: 'Votre sauce a bien été supprimée.'})
    })
    .catch(error => res.status(500).json({ error }));
};


exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if(req.body.like == 1) {
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId);
            sauce.save();
        } 

        if(req.body.like == -1) {
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId);
            sauce.save();
        }

        if(req.body.like == 0) {
            // si utilisateur avait aimé la sauce
            if(sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                sauce.likes--;
                sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
            } else {
                sauce.dislikes--;
                sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
            }
            sauce.save();
        }
        res.status(200).json({ message: 'Vote correctement mis à jour' });
    })
    .catch(error => res.status(500).json({ error }));
}