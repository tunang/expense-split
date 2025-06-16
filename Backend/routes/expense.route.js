import express from 'express'
import { groupCreatorRoute, protectRoute } from '../middleware/auth.middleware.js';
import { createExpense } from '../controllers/expense.controller.js';

const router = express.Router();
router.get('/',protectRoute, groupCreatorRoute, (req, res) => {
    res.json("EXPENSE ROUTE")
})

router.post('/create-expense', protectRoute, createExpense)


export default router;