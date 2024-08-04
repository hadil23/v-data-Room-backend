
const express = require('express');

const router = express.Router();
const panelController = require('../Controllers/panelController');


router.post('/', panelController.createPanel);
router.get('/', panelController.getAllPanels);
router.get('/:id', panelController.getPanelById);
router.put('/:id', panelController.updatePanel);
router.delete('/:id', panelController.deletePanel);
router.post('/virtualDataRooms/savePanels', panelController.savePanels);
router.get('/virtualDataRoom/:id/panels-and-files', panelController.getPanelsAndFilesByVdrId);
router.get('/virtualDataRoom/:vdrId/panels', panelController.getPanelsByVdrId);
module.exports = router;