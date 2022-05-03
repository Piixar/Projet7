const jwtUtils = require('../middleware/jwt.utils');
const models = require('../models');
const Op = models.Sequelize.Op;



exports.createMessage = (req, res, next) => {

    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // let title = req.body.title;
    let content = req.body.content;

    if (!content) {
        res.status(400).json({
          "error": "Le contenu ne peut pas être vide!"
        });
        return;
    }
    models.User.findOne({
        where: { id: userId }
    }).then(function(userFound){
        if(userFound) {
            models.Message.create({
                content : content,
                attachement : '',
                likes : 0,
                UserId: userFound.id
            }).then(function(newMessage) {
                if (newMessage) {
                    return res.status(200).json({
                      'result': "ok"
                  })
                } else {
                    return res.status(500).json({ "error": "impossible d'écrire un message" });
                }
            })
        } else {
            res.status(400).json({ "error": "utilisateur non trouvé" });
        }
    }).catch(function(err){
        return res.status(500).json({ "error": "impossible de vérifier l'utilisateur" });
    }) 
};

exports.listMessages = (req, res, next) => {
  const order = req.query.order;
  const fields = req.query.fields;
  
  models.Message.findAll({
    order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
    attributes : (fields !== '*' && fields != null) ? fields.split(',') : null,
    include: [{
      model: models.User,
      attributes: [ 'username', ]
    },
    {
      model: models.Comment,   

    },

  ]

  }).then(function(messages) {
    if(messages) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ "error": "Pas de messages trouvés "})
    }
  }).catch(function(err){
    console.log(err);
    res.status(500).json({ "error": "colonne invalide" })
  })
};

exports.updateMessage = (req, res, next) => {

    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    const id = req.params.id;

    models.Message.update(
      {content: req.body.content},
      { where: { id: id},
      include: [{
        model: models.User,
        where : {
          [Op.or]: [{userId: userId}, {isAdmin: true}],
        }
      }]
    }
    ).then(result =>{
      if (result > 0 ) {res.status(200).json({ "message": "message modifié" })}
      else {res.status(200).json({ "message": "message non modifié" })}
    })
    .catch(err => res.status(500).json({ "error": "l'utilisateur ne peut pas modifier le message" }))
};

exports.deleteMessage = (req, res, next) => {

    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    const id = req.params.id;
    models.Comment.destroy({
      where: {
        messageId: id
      }
    }).then(result => {


        models.Message.destroy({
          where: { id: id},
        include: [{
          model: models.User,
          where : {
            [Op.or]: [{userId: userId}, {isAdmin: true}],
          }
        }],

      }).then(messages => {
        if (messages) {
          res.send({
            "message": "Votre message a bien été supprimé"
        });
        } else {
          res.send({
            "error": `Impossible de supprimer le message avec  id=${id} et userId =${userId}. `
        });
        }
      }).catch(err => {
        res.status(500).send({"error": "Erreur pour supprimer les commentaires du message id=" + id})
    }).catch(err => {
      res.status(500).send({"error": "Erreur pour supprimer les commentaires du message id=" + id})
    })
    
});
}