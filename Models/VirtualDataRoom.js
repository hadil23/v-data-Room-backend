const getConnection = require("../connection");

class VirtualDataRoom {
  constructor(id, name, ownerId, expiry, createdAt, access, defaultGuestPermission) {
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.expiry = expiry;
    this.createdAt = createdAt || new Date(); // Si createdAt est fourni, l'utiliser, sinon utiliser la date actuelle
    this.access = access;
    this.defaultGuestPermission = defaultGuestPermission;
  }

  static async getAllVirtualDataRooms() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM virtual_data_rooms');
      return rows.map((row) => new VirtualDataRoom(row.id, row.name, row.ownerId, row.expiry, row.createdAt, row.access, row.defaultGuestPermission));
    } catch (error) {
      console.error('Error fetching all virtual data rooms:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async getVirtualDataRoomById(id) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM virtual_data_rooms WHERE id = ?', [id]);
      if (rows.length === 0) {
        return null;
      }
      return new VirtualDataRoom(rows[0].id, rows[0].name, rows[0].ownerId, rows[0].expiry, rows[0].createdAt, rows[0].access, rows[0].defaultGuestPermission);
    } catch (error) {
      console.error('Error fetching virtual data room by ID:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  async createVirtualDataRoom() {
    const connection = await getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO virtual_data_rooms (name, ownerId, expiry, createdAt, access, defaultGuestPermission) VALUES (?, ?, ?, ?, ?, ?)', 
        [this.name, this.ownerId, this.expiry, this.createdAt, this.access, this.defaultGuestPermission]
      );
      const [id] = await connection.query(
        'SELECT LAST_INSERT_ID() as id '
      );
      return id ; 
    } catch (error) {
      console.error('Error creating virtual data room:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  

  async updateVirtualDataRoom() {
    const connection = await getConnection();
    try {
      await connection.query(
        'UPDATE virtual_data_rooms SET name = ?, ownerId = ?, expiry = ?, access = ?, defaultGuestPermission = ? WHERE id = ?', 
        [this.name, this.ownerId, this.expiry, this.access, this.defaultGuestPermission, this.id]
      );
    } catch (error) {
      console.error('Error updating virtual data room:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  async deleteVirtualDataRoom() {
    const connection = await getConnection();
    try {
      await connection.query('DELETE FROM virtual_data_rooms WHERE id = ?', [this.id]);
    } catch (error) {
      console.error('Error deleting virtual data room:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
}

module.exports = VirtualDataRoom;
