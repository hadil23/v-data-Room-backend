const pool = require('../connection');

class User {
  constructor(id, name, email, password, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    
  }

  static async getAlluser() {
    try {
      const [rows] = await pool.query('SELECT * FROM user');
      return rows.map(row => new User(row.id, row.name, row.email, row.password, row.role));
    } catch (error) {
      console.error('Error fetching all user:', error);
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      return new User(rows[0].id, rows[0].name, rows[0].email, rows[0].password, rows[0].role);
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  async createUser() {
    try {
      await pool.query('INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)', [this.name, this.email, this.password, this.role]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser() {
    try {
      await pool.query('UPDATE user SET name = ?, email = ?, password = ?, role = ? WHERE id = ?', [this.name, this.email, this.password, this.role, this.id]);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser() {
    try {
      await pool.query('DELETE FROM user WHERE id = ?', [this.id]);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = User;
