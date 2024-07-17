const pool = require("../connection");

class Files {
  constructor(id, url, user_id, panel_id) {
    this.id = id;
    this.url = url;
    this.user_id = user_id;
    this.panel_id = panel_id;
  }

  static async getAllFiles() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM files');
      return rows.map((row) => new Files(row.id, row.url, row.user_id, row.panel_id));
    } catch (error) {
      console.error('Error fetching all files:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getFileUrlById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT id, url, user_id, panel_id FROM files WHERE id =?', [id.toString()]);
      if (rows.length === 0) {
        return null;
      }
      return new Files(rows[0].id, rows[0].url, rows[0].user_id, rows[0].panel_id);
    } catch (error) {
      console.error('Error fetching file URL by ID:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async createFile(url, user_id, panel_id) {
    const connection = await pool.getConnection();
    try {
      await connection.query('INSERT INTO files (url, user_id, panel_id) VALUES (?, ?, ?)', [url, user_id, panel_id]);
      console.log('File created successfully');
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateFile() {
    const connection = await pool.getConnection();
    try {
      console.log('Updating file with ID:', this.id, 'URL:', this.url, 'user_id:', this.user_id, 'panel_id:', this.panel_id);
      await connection.query('UPDATE files SET url = ?, user_id = ?, panel_id = ? WHERE id = ?', [this.url, this.user_id, this.panel_id, this.id]);
      console.log('File updated successfully');
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteFile() {
    const connection = await pool.getConnection();
    try {
        console.log('Deleting file with ID:', this.id);
        await connection.query('DELETE FROM files WHERE id = ?', [this.id]);
        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    } finally {
        connection.release();
    }
  }
}

module.exports = Files;
