const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    console.log(req.body);

    User.findOne({ email: req.body.email })
        .then(valid => {
            if (valid) {
                console.log('Il semblerait que cette adresse email soit déjà utilisée.');
                res.status(403).json({ message: 'Il semblerait que cette adresse email soit déjà utilisée.' });
            } else {
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(() => res.status(201).json(
                                {
                                    userId: user._id,
                                    token: jwt.sign(
                                        { userId: user._id },
                                        'THE TRUTH IS OUT THERE',
                                        { expiresIn: '2h' }
                                    )
                                }))
                            .catch(error => {
                                console.log(error)
                                res.status(500).json({ error })
                            });
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(401).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log('La paire email/mot de passe n\'est pas correcte.')
                res.status(403).json({ message: 'La paire email/mot de passe n\'est pas correcte.' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            console.log('La paire email/mot de passe n\'est pas correcte.')
                            res.status(403).json({ message: 'La paire email/mot de pass n\'est pas correcte.' });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'THE TRUTH IS OUT THERE',
                                    { expiresIn: '2h' }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};