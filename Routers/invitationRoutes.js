const express = require('express');

const router = express.Router();
const invitationController = require('../Controllers/invitationController');


router.post('/invitations', invitationController.createInvitation);
router.get('/', invitationController.getAllInvitations);
router.get('/:id', invitationController.getInvitationById);
router.put('/:id', invitationController.updateInvitation);
router.delete('/:id', invitationController.deleteInvitation);

module.exports = router;
