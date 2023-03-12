const express = require('express');
const app = express();

const User = require('../models/user');
const bcrypt = require('bcrypt');

app.use(express.json());

exports.signup = (req, res, next) => {
    // on  vérifie l'email s'il existe pas déjà ?????
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                res.status(401).json({ message: 'Cette adresse mail n\' est pas disponible.' })
            } else {
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(() => res.status(201).json({ message: 'Le nouvel utilisateur a bien été créé.' }))
                            .catch(error => res.status(400).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire utilisateur/mot de passe invalide.' })
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: 'Paire utilisateur/mot de passe invalide.' })
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: 'TOKEN'
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}