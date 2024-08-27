const pool = require('../connection');

class Message {
  constructor(id, senderId, recipientId, messageType, message, imageUrl, timestamp, seen) {
    this.id = id;
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.messageType = messageType;
    this.message = message;
    this.imageUrl = imageUrl;
    this.timestamp = timestamp;
    this.seen = seen;
  }

  static async getAllMessages() {
    try {
      const [rows] = await pool.query('SELECT * FROM message');
      return rows.map(row => new Message(
        row.id,
        row.sender_id,
        row.recipient_id,
        row.message_type,
        row.message,
        row.image_url,
        row.timestamp,
        row.seen
      ));
    } catch (error) {
      console.error('Error fetching all messages:', error);
      throw error;
    }
  }

  static async getMessageById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM message WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      return new Message(
        rows[0].id,
        rows[0].sender_id,
        rows[0].recipient_id,
        rows[0].message_type,
        rows[0].message,
        rows[0].image_url,
        rows[0].timestamp,
        rows[0].seen
      );
    } catch (error) {
      console.error(`Error fetching message with ID ${id}:`, error);
      throw error;
    }
  }

  async createMessage() {
    try {
      const [result] = await pool.query(
        'INSERT INTO message (sender_id, recipient_id, message_type, message, image_url, timestamp, seen) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [this.senderId, this.recipientId, this.messageType, this.message, this.imageUrl, this.timestamp, this.seen]
      );
      this.id = result.insertId;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async updateMessage() {
    try {
      await pool.query(
        'UPDATE message SET sender_id = ?, recipient_id = ?, message_type = ?, message = ?, image_url = ?, timestamp = ?, seen = ? WHERE id = ?',
        [this.senderId, this.recipientId, this.messageType, this.message, this.imageUrl, this.timestamp, this.seen, this.id]
      );
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  async deleteMessage() {
    try {
      await pool.query('DELETE FROM message WHERE id = ?', [this.id]);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

module.exports = Message;
