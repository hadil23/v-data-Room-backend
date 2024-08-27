const pool = require('../connection');
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
    console.error('Error fetching all virtual data rooms:', error);
    res.status(500).send({ error: 'An error occurred while fetching the virtual data rooms' });
  }
};


const getVirtualDataRoomById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid ID' });
  }

  try {
      const virtualDataRoom = await VirtualDataRoom.getVirtualDataRoomById(id);
      if (!virtualDataRoom) {
          return res.status(403).send({ error: 'Virtual Data Room not found' });
      }
      res.send(virtualDataRoom);
  } catch (error) {
      console.error(`Error fetching virtual data room by ID: ${error}`);
      res.status(500).send({ error: 'An error occurred while fetching the virtual data room' });
  }
};

 



const createVirtualDataRoom = async (req, res) => {
  try {
    const { name, ownerId, expiryDateTime, access, defaultGuestPermission } = req.body;
    const newRoom = new VirtualDataRoom(null, name, ownerId, expiryDateTime, new Date(), access, defaultGuestPermission);
    const createdRoom = await newRoom.createVirtualDataRoom();
    res.status(201).json({
      message: 'Virtual data room created successfully',
      data: createdRoom
    });
  } catch (error) {
    handleError(error, res);
  }
};

const updateVirtualDataRoom = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, expiryDateTime, defaultGuestPermission, access } = req.body;
  if (!id || !name || !expiryDateTime || !access || !defaultGuestPermission) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const virtualDataRoom = await VirtualDataRoom.getVirtualDataRoomById(id);
    if (!virtualDataRoom) {
      return res.status(404).send('Virtual data room not found');
    }

    virtualDataRoom.name = name;
    
    virtualDataRoom.expiryDateTime = expiryDateTime;
    virtualDataRoom.access = access;
    virtualDataRoom.defaultGuestPermission = defaultGuestPermission;
    await virtualDataRoom.updateVirtualDataRoom();
    res.json({ message: 'Virtual data room updated successfully' });
  } catch (error) {
    handleError(error, res);
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

const downloadFile = async (req, res) => {
  const { guestId } = req.body;
  const { id } = req.params;

  try {
    const virtualDataRoom = req.virtualDataRoom; // Obtention de la salle de données virtuelle à partir du middleware

    // Vérifier si l'invité peut télécharger un fichier
    const canDownload = await virtualDataRoom.canGuestPerformAction(guestId, 'download');

    if (!canDownload) {
      return res.status(403).json({ message: `Guest with ID ${guestId} is not allowed to download file in Virtual Data Room ${id}` });
    }

    // Implémenter ici la logique pour le téléchargement du fichier
    // (Code de téléchargement de fichier à implémenter ici)

    res.json({ message: `Guest with ID ${guestId} is allowed to download file in Virtual Data Room ${id}` });
  } catch (error) {
    handleError(error, res);
  }
};

const editContent = async (req, res) => {
  const { guestId } = req.body;
  const { id } = req.params;

  try {
    const virtualDataRoom = req.virtualDataRoom; // Obtention de la salle de données virtuelle à partir du middleware

    // Vérifier si l'invité peut éditer le contenu
    const canEdit = await virtualDataRoom.canGuestPerformAction(guestId, 'edit');

    if (!canEdit) {
      return res.status(403).json({ message: `Guest with ID ${guestId} is not allowed to edit content in Virtual Data Room ${id}` });
    }

    // Implémenter ici la logique pour l'édition du contenu
    // (Code d'édition de contenu à implémenter ici)

    res.json({ message: `Guest with ID ${guestId} is allowed to edit content in Virtual Data Room ${id}` });
  } catch (error) {
    handleError(error, res);
  }
};

const getViewCount = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send('Invalid ID');
    }
    const viewCount = await VirtualDataRoom.getViewCount(id);
    res.status(200).json({ viewCount });
  } catch (error) {
    console.error('Error getting view count:', error);
    res.status(500).json({ message: 'Error getting view count', error });
  }
};


const incrementViewCount = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Ensure id is a number
  if (isNaN(id)) {
    return res.status(400).send('Invalid ID');
  }

  try {
    const virtualDataRoom = await VirtualDataRoom.getVirtualDataRoomById(id);
    if (!virtualDataRoom) {
      return res.status(404).send('Virtual data room not found');
    }
    await virtualDataRoom.incrementViewCount();
    res.json({ message: 'View count incremented successfully', viewCount: virtualDataRoom.viewCount });
  } catch (error) {
    handleError(error, res);


  }
};



const getVirtualRoomIds = async (req, res) => {
  try {
    console.log('Request received to get virtual room IDs');
    const ids = await VirtualDataRoom.getAllVirtualRoomIds();
    console.log('IDs fetched successfully:', ids);
    res.json(ids);
  } catch (error) {
    console.error('Error fetching virtual room IDs:', error);
    res.status(500).json({ error: 'An error occurred while fetching virtual room IDs' });
  }
};

const getVirtualDataRoomsByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).send({ error: 'Invalid User ID' });
  }

  try {
    const virtualDataRooms = await VirtualDataRoom.getVirtualDataRoomsByUserId(userId);
    if (virtualDataRooms.length === 0) {
      return res.status(404).send({ error: 'No Virtual Data Rooms found for this user' });
    }
    res.send(virtualDataRooms);
  } catch (error) {
    console.error(`Error fetching virtual data rooms by user ID: ${error}`);
    res.status(500).send({ error: 'An error occurred while fetching the virtual data rooms' });
  }
};



module.exports = {
 
  getAllVirtualDataRooms,
  getVirtualDataRoomById,
  getVirtualDataRoomsByUserId,
  createVirtualDataRoom,
  updateVirtualDataRoom,
  deleteVirtualDataRoom,
  downloadFile,
  editContent,
  incrementViewCount,
  getVirtualRoomIds,
  getViewCount
  
};
