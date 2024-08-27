const express = require('express');
const router = express.Router(); // Créez une instance de routeur

const validateToken = require('../Middlewares/validateTokenHandler');
const authentificationController = require('../Controllers/authentificationController');

// Définition des routes
router.post('/sendOTP', authentificationController.sendOTP);
router.post('/verifyOTP', authentificationController.verifyOTP);
router.post('/signin', authentificationController.signin);
router.get('/authenticateToken', validateToken, authentificationController.authenticateToken);

module.exports = router; // Exportez le routeur
