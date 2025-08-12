import express from 'express';
import { createUser, getUser, githubCallback, googleCallback, login } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/jwtAuth.js'; // ✅ Must be a function
import passport from 'passport';

const router = express.Router();
console.log('authenticateToken:', typeof authenticateToken); // should be 'function'
console.log('getUser:', typeof getUser); // should be 'function'
router.post('/register', createUser);
router.post('/login', login);
router.get('/getUser', authenticateToken, getUser);
router.post('/delete', authenticateToken, getUser);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', googleCallback);

router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

router.get('/github/callback', githubCallback);

export default router;
