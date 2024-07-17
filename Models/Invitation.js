const pool = require('../connection');

class Invitation {
    constructor(id, email, firstName, lastName, newEmail, newFirstName, newLastName, userId, virtualDataRoomId) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.newEmail = newEmail;
        this.newFirstName = newFirstName;
        this.newLastName = newLastName;
        this.userId = userId;
        this.virtualDataRoomId = virtualDataRoomId;
    }

    static async getAllInvitations() {
        try {
            const [rows] = await pool.query('SELECT * FROM invitations');
            return rows.map(row => new Invitation(row.id, row.email, row.firstName, row.lastName, row.newEmail, row.newFirstName, row.newLastName, row.userId, row.virtualDataRoomId));
        } catch (error) {
            console.error('Error fetching all invitations:', error);
            throw error;
        }
    }

    static async getInvitationByEmail(email) {
        try {
            const [rows] = await pool.query('SELECT * FROM invitations WHERE email = ?', [email]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error fetching invitation by email:', error);
            throw error;
        }
    }

    static async getInvitationById(id) {
        try {
            const [rows] = await pool.query('SELECT * FROM invitations WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return new Invitation(rows[0].id, rows[0].email, rows[0].firstName, rows[0].lastName, rows[0].newEmail, rows[0].newFirstName, rows[0].newLastName, rows[0].userId, rows[0].virtualDataRoomId);
        } catch (error) {
            console.error(`Error fetching invitation with ID ${id}:`, error);
            throw error;
        }
    }

    async createInvitation() {
        try {
            const result = await pool.query(
                'INSERT INTO invitations (email, firstName, lastName, newEmail, newFirstName, newLastName, userId, virtualDataRoomId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [this.email, this.firstName, this.lastName, this.newEmail, this.newFirstName, this.newLastName, this.userId, this.virtualDataRoomId]
            );
            this.id = result.insertId;
        } catch (error) {
            console.error('Error creating invitation:', error);
            throw error;
        }
    }

    async updateInvitation() {
        try {
            await pool.query(
                'UPDATE invitations SET email = ?, firstName = ?, lastName = ?, newEmail = ?, newFirstName = ?, newLastName = ?, userId = ?, virtualDataRoomId = ? WHERE id = ?',
                [this.email, this.firstName, this.lastName, this.newEmail, this.newFirstName, this.newLastName, this.userId, this.virtualDataRoomId, this.id]
            );
        } catch (error) {
            console.error('Error updating invitation:', error);
            throw error;
        }
    }

    async deleteInvitation() {
        try {
            await pool.query('DELETE FROM invitations WHERE id = ?', [this.id]);
        } catch (error) {
            console.error('Error deleting invitation:', error);
            throw error;
        }
    }
}

module.exports = Invitation;
