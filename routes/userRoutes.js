import express from 'express';
import { crateUserAdmin, createUser, getUser, githubCallback, googleCallback, login, updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/jwtAuth.js'; // ✅ Must be a function
import passport from 'passport';

const router = express.Router();

router.post('/login', login);
router.post('/register', createUser);
router.get('/getUser', authenticateToken, getUser);
router.put('/updateUser/:id', authenticateToken, updateUser);
router.post('/delete/:id', authenticateToken, getUser);

router.post('/crateUserAdmin', crateUserAdmin);


export default router;
