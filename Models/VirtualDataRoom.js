const pool = require("../connection");

class VirtualDataRoom {
  constructor(id, name, ownerId, expiryDateTime, createdAt, access, defaultGuestPermission, viewCount = 0) {
    this.id = id;
    this.name = name;
    
    this.ownerId = ownerId;
    this.expiryDateTime = expiryDateTime || null;
    this.createdAt = createdAt || new Date();
    this.access = access;
    this.defaultGuestPermission = defaultGuestPermission;
    this.viewCount = viewCount;
  }

  static async getAllVirtualDataRooms() {
    try {
      const [rows] = await pool.query('SELECT * FROM virtual_data_rooms');
      return rows.map((row) => new VirtualDataRoom(row.id, row.name, row.ownerId, row.expiryDateTime, row.createdAt, row.access, row.defaultGuestPermission, row.viewCount));
    } catch (error) {
      console.error('Error fetching all virtual data rooms:', error);
      throw error;
    }
  }

  static async getVirtualDataRoomById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM virtual_data_rooms WHERE id = ?', [id]);
      if (rows.length === 0) {
        return null;
      }
      return new VirtualDataRoom(rows[0].id, rows[0].name, rows[0].ownerId, rows[0].expiryDateTime, rows[0].createdAt, rows[0].access, rows[0].defaultGuestPermission, rows[0].viewCount);
    } catch (error) {
      console.error('Error fetching virtual data room by ID:', error);
      throw error;
    }
  }

  async createVirtualDataRoom() {
    const query = 'INSERT INTO virtual_data_rooms (name, ownerId, expiryDateTime, createdAt, access, defaultGuestPermission, viewCount) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [this.name, this.ownerId, this.expiryDateTime, this.createdAt, this.access, this.defaultGuestPermission, this.viewCount];
    try {
      const [result] = await pool.query(query, values);
      this.id = result.insertId;
      return this;
    } catch (error) {
      console.error('Error creating virtual data room:', error);
      throw error;
    }
  }

  async updateVirtualDataRoom() {
    const query = 'UPDATE virtual_data_rooms SET name = ?, ownerId = ?, expiryDateTime = ?, access = ?, defaultGuestPermission = ?, viewCount = ? WHERE id = ?';
    const values = [this.name, this.ownerId, this.expiryDateTime, this.access, this.defaultGuestPermission, this.viewCount, this.id];
    try {
      await pool.query(query, values);
    } catch (error) {
      console.error('Error updating virtual data room:', error);
      throw error;
    }
  }

  async deleteVirtualDataRoom() {
    try {
      await pool.query('DELETE FROM virtual_data_rooms WHERE id = ?', [this.id]);
    } catch (error) {
      console.error('Error deleting virtual data room:', error);
      throw error;
    }
  }

  async incrementViewCount() {
    this.viewCount += 1;
    try {
      await pool.query('UPDATE virtual_data_rooms SET viewCount = ? WHERE id = ?', [this.viewCount, this.id]);
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  }

  async canGuestPerformAction(guestId, action) {
    // Implémenter la logique pour vérifier si l'invité peut effectuer une action spécifique
    return true; // Placeholder pour l'exemple
  }
}

module.exports = VirtualDataRoom;
