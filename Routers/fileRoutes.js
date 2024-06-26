const express = require('express');
const fileController = require('../Controllers/fileController');
const router = express.Router();
const multer = require('multer');
const path = require('path');
router.post('/', fileController.createFile);



// Configuration de multer pour gérer les fichiers uploadés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route pour télécharger des fichiers
router.post('/api/files', upload.array('files'), async (req, res) => {
    const { user_id, panel_id } = req.body;
    const files = req.files;

    try {
        for (const file of files) {
            const filePath = file.path;
            await createFile({ url: filePath, user_id, panel_id });
        }
        res.status(200).json({ message: 'Files uploaded successfully!' });
    } catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).json({ error: 'An error occurred while uploading files', details: err.message });
    }
});





router.get('/:id', fileController. getFileUrlById);
router.put('/files/:id', fileController.updateFile);

router.delete('/files/:id', fileController.deleteFile);

module.exports = router;
