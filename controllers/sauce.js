const Sauce = require('../models/sauce');
const fs = require('fs');
const path = require('path');
const url = require('url');

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
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
            if(req.file) {
                console.log('Nouvelle image - Ancienne à supprimer');
                const imageUrl = `${sauce.imageUrl}`;
                console.log(imageUrl);
                const parsedUrl = url.parse(imageUrl);
                const imageName = path.basename(parsedUrl.pathname);
                console.log(imageName);
                const imagePath = path.join(__dirname, '../images', imageName);
                console.log(imagePath);
                fs.unlink(imagePath, (err) => {
                    if(err) {
                        console.error(err);
                    } else {
                        console.log(`Le fichier ${imageName} a bien été supprimé`);
                    }
                });
            }
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès.'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch( error => res.status(400).json({ error }));
};


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // pourquoi .sauce ? ...req.body ?
    console.log(sauceObject);
    
    delete sauceObject._id;
    delete sauceObject._userId; // pourquoi le delete ? on fait confiance qu'à auth.userId ?

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
    // on cherche d'abord la sauce qui correspond à l'id qu'on veut supprimer
    Sauce.findOne({ _id: req.params.id })
    .then ((sauce) => {
        // on vérifie que le userId de la sauce correspond à l'auth.userId
        if(sauce.userId == req.auth.userId) {
            // si oui, on procède au delete
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => {            
                // on récupère le chemin enregistré dans la bdd
                const imageUrl = `${sauce.imageUrl}`;
                console.log(imageUrl);
                // on récupère l'url sous forme de string
                const parsedUrl = url.parse(imageUrl);
                // on récupère que le nom du fichier avec pathname (chemin vers la ressource) 
                // couplé à path.basename pour récupérer le nom du fichier
                const imageName = path.basename(parsedUrl.pathname);
                console.log(imageName);
                // on récupère le chemin du fichier sur le backend
                const imagePath = path.join(__dirname, '../images', imageName);
                console.log(imagePath);
                // on supprime le fichier avec fs.unlink
                fs.unlink(imagePath, (err) => {
                    if(err) {
                        console.error(err);
                    } else {
                        console.log(`Le fichier ${imageName} a bien été supprimé`);
                    }
                });
                
                res.status(200).json({ message: 'Votre sauce a bien été supprimée.'})
            })
            .catch(error => res.status(500).json({ error }));
        }
    })    
};


exports.likeSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        // si l'utilisateur aime la sauce et n'avait pas encore voté
        if(req.body.like == 1) {
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId);
            sauce.save();
        } 

        // si l'utilisateur n'aime pas la sauce et n'avait pas encore voté
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
            // si l'utilisateur n'avait pas aimé
                sauce.dislikes--;
                sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
            }
            sauce.save();
        }
        res.status(200).json({ message: 'Vote correctement mis à jour' });
    })
    .catch(error => res.status(500).json({ error }));
}