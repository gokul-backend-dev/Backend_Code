import { Router } from 'express';
import { googleAuth, googleAuthCallback, googleAuthSuccess, } from '../controllers/authController.js';
import passport from 'passport';

const router = Router();
console.log("🚀 ~ router:", router)


// Route to initiate Google login
router.get('/google', (req, res, next) => {
    console.log('🚀 Hitting /auth/google route');
    next();
}, googleAuth);

// Google
router.get('/google/callback', googleAuthCallback, googleAuthSuccess);

export default router;
