
const express = require('express');
const router = express.Router();
const pdfController = require('../Controllers/pdfController');

router.get('/download/:id', pdfController.downloadFileById);

module.exports = router;
