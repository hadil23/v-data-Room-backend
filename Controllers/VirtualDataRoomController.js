const getConnection = require('../connection');
const VirtualDataRoom = require('../Models/VirtualDataRoom'); 


const handleError = (err, res) => {
  console.error(err.message);
  switch (err.code) {
    case 'ER_DUP_FIELD':
      res.status(400).send('Duplicate entry for a unique field');
      break;
    case 'ER_NO_SUCH_TABLE':
      res.status(404).send('Table not found');
      break;
    default:
      res.status(500).send('Server error');
  }
};

const getAllVirtualDataRooms = async (req, res) => {
  try {
    const virtualDataRooms = await VirtualDataRoom.getAllVirtualDataRooms();
    res.json(virtualDataRooms);
  } catch (error) {
    handleError(error, res);
  }
};


const getVirtualDataRoomById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const virtualDataRoom = await VirtualDataRoom.getVirtualDataRoomById(id);
    if (virtualDataRoom) {
      res.json(virtualDataRoom);
    } else {
      res.status(404).send('Virtual data room not found');
    }
  } catch (error) {
    handleError(error, res);
  }
};


const createVirtualDataRoom = async (req, res) => {
  const { name, expiry, access, defaultGuestPermission } = req.body;
  if (!name || !expiry || !access || !defaultGuestPermission) {
    res.status(400).send('Missing required fields');
    return;
  }

  const ownerId = 2; // assuming `req.user` contains the authenticated user's information
  const createdAt = new Date();

  const virtualDataRoom = new VirtualDataRoom(null, name, ownerId, expiry, createdAt, access, defaultGuestPermission);
  try {
    const response = await virtualDataRoom.createVirtualDataRoom();
    res.status(201).send({
      message: 'Virtual data room created successfully',
      data: response
    });
  } catch (error) {
    handleError(error, res);
  }
};

const updateVirtualDataRoom = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, expiry, access, defaultGuestPermission } = req.body;
  if (!id || !name || !expiry || !access || !defaultGuestPermission) {
    res.status(400).send('Missing required fields');
    return;
  }

  const ownerId = req.user.id; // assuming `req.user` contains the authenticated user's information
  const createdAt = new Date();

  const virtualDataRoom = new VirtualDataRoom(id, name, ownerId, expiry, createdAt, access, defaultGuestPermission);
  try {
    await virtualDataRoom.updateVirtualDataRoom();
    res.json({ message: 'Virtual data room updated successfully' });
  } catch (error) {
    handleError(error, res);
  }
};
const getVirtualDataRoomId = async (req, res) => {
  try {
    const virtualDataRoomId = await VirtualDataRoom.getVirtualDataRoomId();
    res.json({ virtualDataRoomId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteVirtualDataRoom = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res.status(400).send('Missing required field: id');
    return;
  }

  const virtualDataRoom = new VirtualDataRoom(id);
  try {
    await virtualDataRoom.deleteVirtualDataRoom();
    res.json({ message: 'Virtual data room deleted successfully' });
  } catch (error) {
    handleError(error, res);
  }
};


module.exports = {
  getAllVirtualDataRooms,
  getVirtualDataRoomById,
  createVirtualDataRoom,
  updateVirtualDataRoom,
  deleteVirtualDataRoom,
  getVirtualDataRoomId,
};
