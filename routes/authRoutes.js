import { Router } from 'express';
import { googleAuth, googleAuthCallback, googleAuthSuccess, } from '../controllers/authController.js';

const router = Router();

// Google
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback, googleAuthSuccess);

export default router;
