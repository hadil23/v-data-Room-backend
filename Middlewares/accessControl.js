const pool = require('../connection');
const accessControl = async (req, res, next) => {
    const { virtualDataRoomId } = req.body;
  
    try {
      const [vdrRows] = await pool.query('SELECT access FROM virtual_data_rooms WHERE id = ?', [virtualDataRoomId]);
  
      if (vdrRows.length === 0) {
        return res.status(404).json({ message: 'Virtual Data Room not found' });
      }
  
      const access = vdrRows[0].access;
  
      if (access === 'Anyone with the link') {
        return next(); // Allow access for anyone with the link
      } else if (access === 'specified_people') {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: 'Email is required for specified people access' });
        }
        const [userRows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
  
        if (userRows.length > 0) {
          return next(); // Allow access for specified people
        } else {
          return res.status(403).json({ message: 'Access denied. Only specified people allowed.' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid access type.' });
      }
    } catch (error) {
      console.error('Error in access control middleware:', error);
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };
  
  module.exports = accessControl;