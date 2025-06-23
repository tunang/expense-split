import express from 'express'
import { groupCreatorRoute, protectRoute } from '../middleware/auth.middleware.js';
import { deleteMember } from '../controllers/groupMember.controller.js';
import { createJoinRequest, handleJoinRequest } from '../controllers/groupJoinRequest.controller.js';
import { createInvitation, getReceivedInvitations, getSentInvitations, handleInvitaion } from '../controllers/groupInvitation.controller.js';

const router = express.Router();
router.get('/',protectRoute, groupCreatorRoute, (req, res) => {
    res.json("INVITATIONS ROUTE")
})

// Route to retrieve all invitations that the current user received
router.get('/received', protectRoute, getReceivedInvitations);

// Route to retrieve all invitations that the current user sent
router.get('/group/:groupId/sent', protectRoute, getSentInvitations);

//Create invitations to join a group
router.post('/group/:groupId/member/:userId', protectRoute, groupCreatorRoute, createInvitation);

//Handle join request from others user, only group creator able to do this
router.patch('/group/:groupId/request/:requestId', protectRoute, handleInvitaion);


export default router;