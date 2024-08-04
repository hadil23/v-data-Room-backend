const File = require('../Models/files');

const createFile = async (req, res) => {
    const { url, panel_id, user_id } = req.body;

    // Vérifiez que l'URL est présente
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Appel à votre modèle ou service pour créer le fichier dans la base de données
        const createdFile = await File.createFile(url, user_id, panel_id);

        res.status(201).json(createdFile); // Répondre avec les données du fichier créé
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ error: 'An error occurred while creating the file' });
    }
};


const getFileUrlById = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await File.getFileUrlById(id);
        if (!url) {
            res.status(404).json({ error: 'File not found' });
        } else {
            res.status(200).json(url);
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving the file URL' });
    }
};

const updateFileInDatabase = async (id, url, user_id, panel_id) => {
    const updatedFile = new File(id, url, user_id, panel_id);
    try {
        await updatedFile.updateFile();
        return updatedFile;
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            throw new Error('File with that URL already exists');
        } else {
            throw err;
        }
    }
};

const updateFile = async (req, res) => {
    console.log('updateFile controller called');
    const { id } = req.params;
    const { url, user_id, panel_id } = req.body;

    try {
        const updatedFile = await updateFileInDatabase(id, url, user_id, panel_id);
        res.status(200).json(updatedFile);
    } catch (err) {
        console.error(err);
        if (err.message === 'File with that URL already exists') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'An error occurred while updating the file' });
        }
    }
};

const deleteFile = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Attempting to delete file with ID: ${id}`);
        const file = new File(id);
        await file.deleteFile();
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        console.error(`Error occurred while deleting file with ID: ${id}`, err);
        res.status(500).json({ error: 'An error occurred while deleting the file', details: err.message });
    }
};

const uploadFileToPanel = async (req, res) => {
    const { panel_id, user_id } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'File is required' });
    }

    try {
        const url = await File.uploadFileToCloudinary(file);
        const createdFile = await File.createFile(url, user_id, panel_id);

        res.status(201).json(createdFile); // Répondre avec les données du fichier créé
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'An error occurred while uploading the file' });
    }
};

const getFilesByPanelId = async (req, res) => {
    const { panel_id } = req.params;
    try {
        const files = await File.getFilesByPanelId(panel_id);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files by panel ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching files by panel ID' });
    }
};
module.exports = {
    createFile,
    getFileUrlById,
    getFilesByPanelId,
    updateFile,
    deleteFile,
    uploadFileToPanel,
};
