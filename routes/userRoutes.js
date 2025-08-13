import express from 'express';
import { crateUserAdmin, createUser, getUser, deleteUser, getAllUsers, login, updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/jwtAuth.js'; // ✅ Must be a function

const router = express.Router();

router.post('/login', login);
router.post('/register', createUser);
router.get('/getUser', authenticateToken, getUser);
router.put('/updateUser/:id', authenticateToken, updateUser);
router.delete('/delete/:id', authenticateToken, deleteUser);
router.get('/getAll', authenticateToken, getAllUsers);

router.post('/crateUserAdmin', crateUserAdmin);


export default router;
