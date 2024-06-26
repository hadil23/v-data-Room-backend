const getConnection = require('../connection');
//const sendToken = require('../utils/jwtToken');
const jwt = require('jsonwebtoken');
class Invitation {
    constructor(id, email, permissions, accessExpiry, message, userId, fileId) {
        this.id = id;
        this.email = email;
        this.permissions = permissions;
        this.accessExpiry = accessExpiry;
        this.message = message;
        this.userId = userId;
        this.fileId = fileId;
    }

    static async getAllInvitations() {
        const connection = await getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM Invitation');
            return rows.map(row => new Invitation(row.id, row.email, row.permissions, row.accessExpiry, row.message, row.userId, row.fileId));
        } catch (error) {
            console.error('Error fetching all invitations:', error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    static async getInvitationById(id) {
        const connection = await getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM Invitation WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return new Invitation(rows[0].id, rows[0].email, rows[0].permissions, rows[0].accessExpiry, rows[0].message, rows[0].userId, rows[0].fileId);
        } catch (error) {
            console.error(`Error fetching invitation with ID ${id}:`, error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    static async getInvitationByEmail(email) {
        const connection = await getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM Invitation WHERE email = ?', [email]);
            if (rows.length === 0) return null;
            return new Invitation(rows[0].id, rows[0].email, rows[0].permissions, rows[0].accessExpiry, rows[0].message, rows[0].userId, rows[0].fileId);
        } catch (error) {
            console.error(`Error fetching invitation with email ${email}:`, error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    async createInvitation() {
        const connection = await getConnection();
       
        try {
            await connection.query('INSERT INTO invitation (email, permissions, accessExpiry, message, userId, fileId) VALUES (?, ?, ?, ?, ?, ?)', [this.email, JSON.stringify(this.permissions), this.accessExpiry, this.message, this.userId, this.fileId]);
        } catch (error) {
            console.error('Error creating invitation:', error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    async updateInvitation() {
        const connection = await getConnection();
        console.log(this.permissions , "ssssssssssssssss")
        try {
            await connection.query('UPDATE Invitation SET email = ?, permissions = ?, accessExpiry = ?, message = ?, userId = ?, fileId = ? WHERE id = ?', [this.email, this.permissions, this.accessExpiry, this.message, this.userId, this.fileId, this.id]);
        } catch (error) {
            console.error('Error updating invitation:', error);
            throw error;
        } finally {
            await connection.end();
        }
    }

    async deleteInvitation() {
        const connection = await getConnection();
        try {
            await connection.query('DELETE FROM Invitation WHERE id = ?', [this.id]);
        } catch (error) {
            console.error('Error deleting invitation:', error);
            throw error;
        } finally {
            await connection.end();
        }
    }
}

module.exports = Invitation;