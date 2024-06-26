const express = require('express');
const router = express.Router();
const virtualDataRoomController = require('../Controllers/VirtualDataRoomController');

router.post('/virtualDataRooms', virtualDataRoomController.createVirtualDataRoom);
router.get('/virtualDataRoom', virtualDataRoomController.createVirtualDataRoom);
router.get('/virtualDataRooms/:id', virtualDataRoomController.getVirtualDataRoomById);
router.patch('/virtualDataRooms/:id', virtualDataRoomController.updateVirtualDataRoom);
router.delete('/virtualDataRooms/:id', virtualDataRoomController.deleteVirtualDataRoom);



module.exports = router;