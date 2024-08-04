const pool = require('../connection');

class Panel {
  constructor(id, vdrId, name) {
    this.id = id;
    this.vdrId = vdrId;
    this.name = name;
  }
  

  static async getAllPanels() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT id, vdrId, name FROM panel');
      return rows.map((row) => new Panel(row.id, row.vdrId, row.name));
    } catch (error) {
      Panel.handleError(error);
    } finally {
      connection.release();
    }
  }

  static async getPanelById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT id, vdrId, name FROM panel WHERE id = ?', [id]);
      if (rows.length === 0) {
        return null;
      }
      return new Panel(rows[0].id, rows[0].vdrId, rows[0].name);
    } catch (error) {
      Panel.handleError(error);
    } finally {
      connection.release();
    }
  }

  static async createPanel(vdrId, name) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('INSERT INTO panel (vdrId, name) VALUES (?, ?)', [vdrId, name]);
      const [rows] = await connection.query('SELECT LAST_INSERT_ID() AS id'); // Retrieve the generated ID
      return new Panel(rows[0].id, vdrId, name); // Return the panel with the generated ID
    } catch (error) {
      Panel.handleError(error);
    } finally {
      connection.release();
    }
  }

  static async updatePanel(id, vdrId, name) {
    const connection = await pool.getConnection();
    try {
      await connection.query('UPDATE panel SET vdrId = ?, name = ? WHERE id = ?', [vdrId, name, id]);
    } catch (error) {
      Panel.handleError(error);
    } finally {
      connection.release();
    }
  }

  static async deletePanel(id) {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM panel WHERE id = ?', [id]);
    } catch (error) {
      Panel.handleError(error);
    } finally {
      connection.release();
    }
  }

  static async getPanelsByVdrId(vdrId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT id, vdrId, name FROM panel WHERE vdrId = ?', [vdrId]);
      return rows.map((row) => new Panel(row.id, row.vdrId, row.name));
    } catch (error) {
      console.error('Error fetching panels by VDR ID:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
  static async getPanelsByVdrId(vdrId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT id, vdrId, name FROM panel WHERE vdrId = ?', [vdrId]);
      return rows.map((row) => new Panel(row.id, row.vdrId, row.name));
    } catch (error) {
      Panel.handleError(error);
    } finally {
      connection.release();
    }
  }

  static handleError(error) {
    console.error(error);
    throw error;
  }
}




module.exports = Panel;
