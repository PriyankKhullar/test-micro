const express = require('express');
const router = express.Router();
const AuthController = require('./../api/Controllers/AuthController');

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/profile', AuthController.profile);
router.post('/edit-profile', AuthController.editProfile);

module.exports = router;