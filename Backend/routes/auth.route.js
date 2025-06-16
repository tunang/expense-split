import express from  "express";
import { login, logout, me, refreshToken, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get('/', (req, res) => {
    res.json("AUTH ROUTE")
})

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refresh-token', refreshToken)

router.get('/me', protectRoute, me)

export default router;
