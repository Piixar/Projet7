const bcrypt = require('bcrypt');  // npm install --save bcrypt
const jwtUtils = require('../middleware/jwt.utils');
const models = require('../models');


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

exports.signup = (req, res, next) => {

    // Params
    const user = {...req.body};



    if(user.email == null || user.username == null || user.password == null) {
        return res.status(400).json({ 'error': 'un des champs est vide !' });
    }

    if(user.username.length >=13 || user.username.length <=4) {
        return res.status(400).json({ "error": "votre pseudo doit être compris entre 5 et 12 caractères" });
    }

    if(!EMAIL_REGEX.test(user.email)) {
        return res.status(400).json({ "error" : "votre email n'est pas valide" });
    }

    if(!PASSWORD_REGEX.test(user.password)) {
        return res.status(400).json({ "error": "votre password doit être compris entre 4 et 8 caractères et doit contenir un chiffre" });
    }
    
    // Vérifie pseudo length, mail regex, pass etc

    models.User.findOne({
        attributes: ['email'],
        where : { email: user.email }
    })
    .then(function(userFound) {
        if(!userFound) {

            bcrypt.hash(user.password, 5, function( err, bcryptedPassword) {
                const newUser = models.User.create({
                    email: user.email,
                    username: user.username,
                    password: bcryptedPassword,
                    bio: user.bio,
                    isAdmin: 0
                })
                .then(function(newUser) {
                    return res.status(200).json({
                        'userId': newUser.id
                    })
                })
                .catch(function(err) {
                    return res.status(500).json({ "error": "impossible d'ajouter un utilisateur" });
                });
            })

        } else {
            return res.status(409).json({ "error": "l'utilisateur existe déjà" });
        }
    })
    .catch(function(err) {
        return res.status(500).json({ "error": "impossible de vérifier l'utilisateur" });
    });
};
exports.login = (req, res , next) => {

    // Params
    const user = {...req.body};

    if(user.email == null || user.password == null) {
        return res.status(400).json({ 'error': 'un des champs est vide !' });
    }

    models.User.findOne({
        where: { email: user.email }
    })
    .then(function(userFound) {
        if(userFound) {

            bcrypt.compare(user.password, userFound.password, function(errBcrypt, resBcrypt) {
                if(resBcrypt) {
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
                    })
                } else {
                    return res.status(403).json({ 'error': 'password invalide' });
                }
            });
        } else {
            return res.status(400).json({ "error": "l'utilisateur n'existe pas dans la base de donnée" });
        }

    })
    .catch(function(err) {
        return res.status(500).json({ "error": "impossible de vérifier l'utilisateur" });
    })
};

exports.getUserprofile = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    if(userId < 0)
        return res.status(400).json({ 'error': 'token invalide' });

    models.User.findOne({
        attributes: [ 'id', 'email', 'username', 'bio', 'isAdmin' ],
        where: { id: userId }
    }).then(function(user) {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ "error": "l'utilisateur n'éxiste pas" });
        }
    }).catch(function(err) {
        res.status(500).json({ "error": "impossible d'accéder à l'utilisateur" });
    })
};

exports.updateUserProfile = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    let bio = req.body.bio;

    models.User.findOne({
        attributes: ['id', 'bio'],
        where: { id: userId }
    }).then(function(userFound) {
        if(userFound) {
            userFound.update({
                bio: (bio ? bio : userFound.bio)
            }).then(function(userFound){
                return res.status(200).json(userFound);
            }).catch(function(err){
                return res.status(400).json({ "error": "impossible de modifier l'utilisateur" });
            })
        } else {
            res.status(400).json({ "error": "impossible de trouver l'utilisateur" });
        }
    }).catch(function(err){
        return res.status(500).json({ "error": "impossible de vérifier l'utilisateur" });
    })

}






