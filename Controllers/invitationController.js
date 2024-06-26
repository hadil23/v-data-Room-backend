const Invitation = require('../Models/Invitation');
const dotenv = require("dotenv");
const sendMail = require("../utils/sendMail");
dotenv.config({ path: "./env" });
const jwt = require('jsonwebtoken');

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
 

const createActivationToken = (data) => {
    // Vous devez définir votre clé secrète JWT dans votre fichier .env
    const secretKey = process.env.JWT_SECRET_KEY;

    // Générer le jeton d'activation avec les données fournies
    const token = jwt.sign(data, secretKey, { expiresIn: '1h' }); // Le jeton expire dans 1 heure

    return token;
};
exports.createInvitation = async (req, res, next) => {
    const {
        id,
        email,
        permissions,
        accessExpiry,
        message,
        userId,
        fileId,
      } = req.body;
  
      // Vérifier si l'invitation existe déjà dans la base de données
      const invitationExists = await Invitation.getInvitationByEmail(email);
      if (invitationExists) {
        return res.status(400).json({
          success: false,
          message: "Invitation already exists",
        });
      }
  
      // Champs "activated" défini sur false par défaut
      const activated = false;
  
      // Créer une nouvelle instance de la classe Invitation
      const newInvitation = new Invitation(
       id,
        email,
        permissions,
        new Date(accessExpiry),
        message,
        userId,
        fileId
      );
  
      // Enregistrer l'invitation dans la base de données
      try {
        await newInvitation.createInvitation();
  
        // Créer le jeton d'activation
        const activationToken = createActivationToken({ email });
  
        // Construire l'URL d'activation
        const activationUrl = `http://localhost:3000/activation/${activationToken}`;
  
        // Modifier le texte du lien pour dire "Cliquez ici"
        const activationLink = `<a href="${activationUrl}">Cliquez ici</a>`;
  
      // Envoyer l'e-mail d'activation
      try {
        await sendMail({
          email: email,
          subject: "Activez votre invitation",
          // Utiliser le lien modifié dans le corps de l'e-mail
          html: `Bonjour, veuillez ${activationLink} pour activer votre invitation.`,
        });
        res.status(201).json({
          success: true,
          message: `Veuillez vérifier votre e-mail (${email}) pour activer votre invitation !`,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.updateInvitation = async (req, res) => {
    const { id } = req.params;
    const { email, permissions, accessExpiry, message, userId, fileId } = req.body;
    const updatedInvitation = new Invitation(id, email, permissions, accessExpiry, message, userId, fileId);

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
