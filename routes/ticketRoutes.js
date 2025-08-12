import express from 'express';
import { createTicket, getAllTickets, updateTicket, deleteTicket, viewTicket } from '../controllers/ticketController.js';
import { authenticateToken } from '../middlewares/jwtAuth.js';

const router = express.Router();

// Create a new ticket
router.post('/createTicket', authenticateToken, createTicket);

// Get all tickets
router.get('/getAll', authenticateToken, getAllTickets);

// Get all tickets
router.get('/viewTicket/:id', authenticateToken, viewTicket);

// Update a ticket by ID
router.put('/update/:id', authenticateToken, updateTicket);

// Delete a ticket by ID
router.delete('/delete/:id', authenticateToken, deleteTicket)


export default router;