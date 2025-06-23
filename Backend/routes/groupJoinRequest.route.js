import express from 'express'
import { groupCreatorRoute, protectRoute } from '../middleware/auth.middleware.js';
import { deleteMember } from '../controllers/groupMember.controller.js';
import { createJoinRequest, getJoinRequest, handleJoinRequest } from '../controllers/groupJoinRequest.controller.js';

const router = express.Router();
router.get('/',protectRoute, groupCreatorRoute, (req, res) => {
    res.json("GROUPJOINREQUEST ROUTE")
})
//Get join request for a group
router.get('/:groupId', protectRoute, getJoinRequest);

//Create join request to join a group
router.post('/:groupId', protectRoute, createJoinRequest);

//Handle join request from others user, only group creator able to do this
router.patch('/group/:groupId/request/:requestId', protectRoute, groupCreatorRoute, handleJoinRequest);


export default router;