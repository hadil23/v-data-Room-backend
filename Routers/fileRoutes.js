const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../Controllers/fileController'); // Assuming fileController handles saving files
router.post('/', fileController.createFile);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/api/files', upload.single('file'), async (req, res) => { // Assuming single file upload
  const { url, user_id, panel_id } = req.body; // Adjust based on your request body structure

  try {
    const savedFile = await fileController.createFile({ url, user_id, panel_id }); // Call createFile function
    res.status(201).json({ message: 'File uploaded and saved successfully!', data: savedFile }); // Send a success response with data (optional)
  } catch (err) {
    console.error('Error saving file:', err);
    res.status(500).json({ error: 'An error occurred while saving the file', details: err.message }); // Send an error response
  }
});

router.post('/api/files/panel', upload.single('file'), async (req, res) => {
  const { panel_id, user_id } = req.body;

  try {
    const uploadedFile = await fileController.uploadFileToPanel(req.file, panel_id, user_id);
    res.status(201).json({ message: 'File uploaded to panel successfully!', data: uploadedFile });
  } catch (err) {
    console.error('Error uploading file to panel:', err);
    res.status(500).json({ error: 'An error occurred while uploading the file to panel', details: err.message });
  }
});

router.get('/file/:panel_id', fileController.getFilesByPanelId);

module.exports = router;
