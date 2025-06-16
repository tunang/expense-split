import express from  "express";
import { groupCreatorRoute, protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, deleteGroup, editGroup, getGroups, getGroupById } from "../controllers/group.controller.js";
const router = express.Router();


// Route to get all groups
router.get('/', protectRoute, getGroups);

// Route to get a group by id
router.get('/:id', protectRoute, getGroupById);

// Route to create a group 
router.post('/create-group', protectRoute, createGroup);

// Route to edit an existing group
router.put('/edit-group/:groupId', protectRoute, groupCreatorRoute, editGroup);

// Route to delete a group
router.delete('/delete-group/:groupId', protectRoute, groupCreatorRoute, deleteGroup);

export default router;
