const jwtUtils = require('../middleware/jwt.utils');
const models = require('../models');
const Op = models.Sequelize.Op;

exports.createComment = (req, res, next) => {

    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    let comment = req.body.comment;
    let messageId = req.body.messageId;

    if (!comment) {
        res.status(400).json({
          "error": "Le contenu ne peut pas être vide!"
        });
        return;
    }

    models.User.findOne({
        where: { id: userId }
    }).then(function(userFound){
        if(userFound) {
            models.Message.findOne({
                where: { id: messageId }
            }).then(function(messageFound){

                if(messageFound) {
                    models.Comment.create({
                        comment : comment,
                        UserId: userFound.id,
                        messageId: messageId,
                    }).then(function(newComment) {
                        if (newComment) {
                            return res.status(200).json(newComment)
                        } else {
                            return res.status(500).json({ "error": "impossible d'écrire un commentaire" });
                        }
                    })
                } else {
                    res.status(400).json({ "error": "message non trouvé" });
                }
            });
        } else {
            res.status(400).json({ "error": "utilisateur non trouvé" });
        }
    })
};

exports.readComment = (req, res, next) => {

    const order = req.query.order;
    const fields = req.body.fields;

    models.Comment.findAll({
        order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
        attributes : (fields !== '*' && fields != null) ? fields.split(',') : null,
        include: [{
          model: models.User,
          attributes: [ 'username' ]
        }],
    }).then(function(commentFound){
        if(commentFound) {
           res.status(200).json(commentFound);
        } else {
            res.status(400).json({ "error": "commentaires non trouvés" });
        }
    })
};

exports.updateComment = (req ,res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
        
        const id = req.params.id;
        
        models.Comment.update(
      {comment: req.body.comment},
      {where: { id: id},
      include: [{
        model: models.User,
        where : {
          [Op.or]: [{userId: userId}, {isAdmin: true}],
        }
      }]
    }
      ).then(result =>{
          if (result > 0 ) {res.status(200).json({ "message": "commentaire modifié" })}
          else {res.status(200).json({ "error": "commentaire non modifié" })}
        })
    .catch(err => res.status(500).json({ "error": "l'utilisateur ne peut pas modifier le commentaire" }))
};

exports.deleteComment = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    const id = req.params.id;

      models.Comment.destroy({
        where: { id: id},
        include: [{
          model: models.User,
          where : {
            [Op.or]: [{userId: userId}, {isAdmin: true}],
          }
        }],
      }).then(result => {
        if (result) {
          res.send({
            "message": "Votre commentaire a bien été supprimé"
        });
        } else {
          res.send({
            "error": `Impossible de supprimer le commentaire avec id=${id}. `
        });
        }
      }).catch(err => {
        res.status(500).send({"error": "Erreur pour supprimer le commentaire id=" + id})
      })
};