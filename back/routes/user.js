const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profil', userCtrl.getUserprofile);
router.put('/profil', userCtrl.updateUserProfile);

module.exports = router;