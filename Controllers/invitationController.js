const pool = require('../connection');
const Invitation = require('../Models/Invitation');
const sendVerificationCode = require("../utils/sendVerificationCode");

exports.getAllInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.getAllInvitations();
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invitations', error });
  }
};

exports.getInvitationById = async (req, res) => {
  const { id } = req.params;
  try {
    const invitation = await Invitation.getInvitationById(id);
    if (!invitation) {
      res.status(404).json({ message: 'Invitation not found' });
    } else {
      res.status(200).json(invitation);
    }
  } catch (error) {
    res.status(500).json({ message: `Error fetching invitation with ID ${id}`, error });
  }
};

exports.createInvitation = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    newEmail,
    newFirstName,
    newLastName,
    userId,
    virtualDataRoomId
  } = req.body;

  console.log('Received data:', req.body);
  console.log('Email:', email);
  console.log('FirstName:', firstName);
  console.log('LastName:', lastName);
  console.log('NewEmail:', newEmail);
  console.log('NewFirstName:', newFirstName);
  console.log('NewLastName:', newLastName);
  console.log('UserId:', userId);
  console.log('VirtualDataRoomId:', virtualDataRoomId);

  try {
    const [user] = await pool.query('SELECT * FROM user WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const invitationExists = await Invitation.getInvitationByEmail(email);
    if (invitationExists) {
      return res.status(400).json({
        success: false,
        message: "Invitation already exists",
      });
    }
   

    const newInvitation = new Invitation(
      null,
      email,
      firstName,
      lastName,
      newEmail,
      newFirstName,
      newLastName,
      userId,
      virtualDataRoomId
    );

    await newInvitation.createInvitation();
    const verificationCode = "123456";

    console.log('Calling sendVerificationCode with:', email, verificationCode, virtualDataRoomId);
    await sendVerificationCode(email, verificationCode, virtualDataRoomId);

    res.status(201).json({
      success: true,
      message: `Please verify your email (${email}) to activate your invitation!`,
    });
  } catch (error) {
    console.error('Error in createInvitation:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateInvitation = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    firstName,
    lastName,
    newEmail,
    newFirstName,
    newLastName,
    userId,
    virtualDataRoomId
  } = req.body;

  // Verify all required fields are provided
  if (!email || !firstName || !lastName || !userId || !virtualDataRoomId) {
    return res.status(400).json({
      success: false,
      message: 'All required fields (email, firstName, lastName, userId, virtualDataRoomId) must be provided'
    });
  }

  const updatedInvitation = new Invitation(
    id,
    email,
    firstName,
    lastName,
    newEmail,
    newFirstName,
    newLastName,
    userId,
    virtualDataRoomId
  );

  try {
    await updatedInvitation.updateInvitation();
    res.status(200).json({ message: 'Invitation updated successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error updating invitation with ID ${id}`, error });
  }
};

exports.deleteInvitation = async (req, res) => {
  const { id } = req.params;
  try {
    const invitation = await Invitation.getInvitationById(id);
    if (!invitation) {
      res.status(404).json({ message: 'Invitation not found' });
    } else {
      await invitation.deleteInvitation();
      res.status(200).json({ message: 'Invitation deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: `Error deleting invitation with ID ${id}`, error });
  }
};
 
exports.getAllInvitationsWithStatus = async (req, res) => {
  try {
    // Logique pour récupérer les invitations avec les statuts
    const [virtualDataRooms] = await pool.query('SELECT * FROM virtual_data_rooms');
    const [invitations] = await pool.query('SELECT * FROM invitations');

    const result = virtualDataRooms.map(room => {
      const roomInvitations = invitations.filter(invitation => invitation.virtualDataRoomId === room.id);
      const status = roomInvitations.length > 0 ? 'sended' : 'drafted';
      return { virtualDataRoomId: room.id, status };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching invitations with status:', error);
    res.status(500).json({ error: 'Error fetching invitations with status' });
  }
};