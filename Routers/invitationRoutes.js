const express = require('express');

const router = express.Router();
const invitationController = require('../Controllers/invitationController');
const accessControl = require ('../Middlewares/accessControl');

router.get('/getAllInvitationsWithStatus', invitationController.getAllInvitationsWithStatus);
router.get('/invitations', invitationController.getAllInvitations);
router.get('/:id', invitationController.getInvitationById);
router.post('/',accessControl, invitationController.createInvitation);
router.put('/:id', invitationController.updateInvitation);
router.delete('/:id', invitationController.deleteInvitation);

module.exports = router;
