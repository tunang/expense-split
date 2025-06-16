import express from 'express'
import { groupCreatorRoute, protectRoute } from '../middleware/auth.middleware.js';
import { deleteMember, leaveGroup, getMembers } from '../controllers/groupMember.controller.js';

const router = express.Router();


router.get('/:groupId', protectRoute, groupCreatorRoute, getMembers);

//Remove member from group, only group creator 
router.delete('/group/:groupId/member/:userId', protectRoute, groupCreatorRoute, deleteMember);

//Leave group
router.delete('/group/:groupId/leave', protectRoute, leaveGroup);

export default router;
