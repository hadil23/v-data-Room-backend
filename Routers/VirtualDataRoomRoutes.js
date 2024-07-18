const express = require('express');
const router = express.Router();
const virtualDataRoomController = require('../Controllers/VirtualDataRoomController');

router.post('/virtualDataRooms', virtualDataRoomController.createVirtualDataRoom);
router.get('/:id', virtualDataRoomController.getVirtualDataRoomById);
router.get('/', virtualDataRoomController.getAllVirtualDataRooms);
router.patch('/virtualDataRooms/:id', virtualDataRoomController.updateVirtualDataRoom);
router.delete('/virtualDataRooms/:id', virtualDataRoomController.deleteVirtualDataRoom);
router.post('/virtual-data-room/:id/download', virtualDataRoomController.downloadFile);
router.post('/virtual-data-room/:id/edit', virtualDataRoomController.editContent);

router.put('/virtualDataRooms/:id/view', virtualDataRoomController.incrementViewCount);

module.exports = router;