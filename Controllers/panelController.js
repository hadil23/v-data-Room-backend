const getConnection = require('../connection'); // Adjust the path as necessary
const Panel = require('../Models/panel'); // Adjust the path as necessary

const handleError = (error) => {
  console.error(error.message);
};

// Get all panels
async function getAllPanels(req, res) {
  try {
    const panels = await Panel.getAllPanels();
    res.json(panels);
  } catch (error) {
    handleError(error);
    res.status(500).send('Server error');
  }
}

// Get a panel by ID
async function getPanelById(req, res) {
  const { id } = req.params;
  try {
    const panel = await Panel.getPanelById(id);
    if (panel) {
      res.json(panel);
    } else {
      res.status(404).send('Panel not found');
    }
  } catch (error) {
    handleError(error);
    res.status(500).send('Server error');
  }
}

// Create a panel
async function createPanel(req, res) {
  const { vdrId, name } = req.body;
  try {
    const panel = await Panel.createPanel(vdrId, name);
    res.status(201).json(panel);
  } catch (error) {
    handleError(error);
    res.status(500).send('Server error');
  }
}

// Update a panel
async function updatePanel(req, res) {
  const { id } = req.params;
  const { vdrId, name } = req.body;
  try {
    await Panel.updatePanel(id, vdrId, name);
    res.send('Panel updated');
  } catch (error) {
    handleError(error);
    res.status(500).send('Server error');
  }
}

// Delete a panel
async function deletePanel(req, res) {
  const { id } = req.params;
  try {
    await Panel.deletePanel(id);
    res.send('Panel deleted');
  } catch (error) {
    handleError(error);
    res.status(500).send('Server error');
  }
}

// Sauvegarder des panels dans la base de données
async function savePanels(req, res) {
  const { virtualRoomId, panels } = req.body;
  try {
    // Assurez-vous que virtualRoomId et panels sont présents
    if (!virtualRoomId || !panels) {
      return res.status(400).send('Bad request: virtualRoomId and panels are required');
    }

    // Effectuez les opérations pour sauvegarder les panels dans la base de données
    // Vous pouvez utiliser le modèle Panel pour créer de nouveaux panels ou mettre à jour les panels existants dans la base de données

    // Exemple: créer un nouveau panel pour chaque élément de la liste des panels
    const savedPanels = await Promise.all(panels.map(async panel => {
      return await Panel.createPanel(virtualRoomId, panel.title);
    }));

    // Envoyer une réponse avec les panels sauvegardés
    res.status(201).json(savedPanels);
  } catch (error) {
    // Gérer les erreurs
    console.error('Error saving panels:', error);
    res.status(500).send('Server error');
  }
}


module.exports = {
  getAllPanels,
  getPanelById,
  createPanel,
  updatePanel,
  deletePanel,
  savePanels,
};
