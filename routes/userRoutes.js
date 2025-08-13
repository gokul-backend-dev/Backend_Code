import express from 'express';
import { crateUserAdmin, createUser, getUser, deleteUser, dropDown, login, updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/jwtAuth.js'; // ✅ Must be a function

const router = express.Router();

router.post('/login', login);
router.post('/register', createUser);
router.get('/getUser', authenticateToken, getUser);
router.put('/updateUser/:id', authenticateToken, updateUser);
router.post('/delete/:id', authenticateToken, deleteUser);
router.get('/getAll', authenticateToken, dropDown);

router.post('/crateUserAdmin', crateUserAdmin);


export default router;
