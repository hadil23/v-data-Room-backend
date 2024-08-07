const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.post('/test', authController.verifyEmail);

module.exports = router;
