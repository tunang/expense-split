import express from 'express'
import { groupCreatorRoute, protectRoute } from '../middleware/auth.middleware.js';
import { createExpense, getExpense, deleteExpense } from '../controllers/expense.controller.js';

const router = express.Router();
router.get('/',protectRoute, groupCreatorRoute, (req, res) => {
    res.json("EXPENSE ROUTE")
})

router.get('/:groupId', protectRoute, getExpense)

router.post('/create-expense', protectRoute, createExpense)

router.delete('/delete-expense/:id', protectRoute, deleteExpense)

export default router;