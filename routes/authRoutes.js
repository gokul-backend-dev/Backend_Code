import { Router } from 'express';
import { googleAuth, googleAuthCallback, googleAuthSuccess, githubAuth, githubAuthCallback, githubAuthSuccess } from '../controllers/authController.js';

const router = Router();

// Google
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback, googleAuthSuccess);

// GitHub
router.get('/github', githubAuth);
router.get('/github/callback', githubAuthCallback, githubAuthSuccess);

export default router;
