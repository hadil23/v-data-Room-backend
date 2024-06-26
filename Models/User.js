const getConnection = require('../connection');

class User {
    constructor(id, name, email, password, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    static async getAllUsers() {
        const connection = await getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM User');
            return rows.map(row => new User(row.id, row.name, row.email, row.password, row.role));
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    static async getUserById(id) {
        const connection = await getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM User WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return new User(rows[0].id, rows[0].name, rows[0].email, rows[0].password, rows[0].role);
        } catch (error) {
            console.error(`Error fetching user with ID ${id}:`, error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    async createUser() {
        const connection = await getConnection();
        try {
            await connection.query('INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)', [this.name, this.email, this.password, this.role]);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    async updateUser() {
        const connection = await getConnection();
        try {
            await connection.query('UPDATE User SET name = ?, email = ?, password = ?, role = ? WHERE id = ?', [this.name, this.email, this.password, this.role, this.id]);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    async deleteUser() {
        const connection = await getConnection();
        try {
            await connection.query('DELETE FROM User WHERE id = ?', [this.id]);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        } finally {
            await connection.end();
        }
    }
}

module.exports = User;
