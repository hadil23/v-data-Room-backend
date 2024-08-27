const pool = require('../connection');
const bcrypt = require('bcryptjs');

class User {
  constructor(id, name, email, password, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async getAllUsers() { // Correction: getAllUsers au lieu de getAlluser
    try {
      const [rows] = await pool.query('SELECT * FROM user');
      return rows.map(row => new User(row.id, row.name, row.email, row.password, row.role));
    } catch (error) {
      console.error('Error fetching all users:', error); // Correction de l'erreur de nom de méthode
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
      const result = await pool.query('INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)', [this.name, this.email, this.password, this.role]);
      const insertedId = result[0].insertId; // Obtenez l'ID inséré
      return new User(insertedId, this.name, this.email, this.password, this.role); // Retournez l'utilisateur créé avec l'ID
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
      if (rows.length === 0) return null;
  
      const user = rows[0];
      // Comparaison des mots de passe en clair
      if (password === user.password) {
        return new User(user.id, user.name, user.email, user.password, user.role);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error logging in:', error);
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
