const express = require('express');
const router = express.Router();
const { generateResponse } = require('../Controllers/chatbotController');

router.post('/chat', generateResponse);

module.exports = router;