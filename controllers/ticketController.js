import Ticket from '../models/Ticket.js';

export async function createTicket(req, res) {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const createdBy = req.user._id;

        const existing = await Ticket.findOne({ title });
        if (existing) {
            return res.status(400).json({ message: 'Ticket with this title already exists' });
        }

        const newTicket = new Ticket({ title, description, createdBy });

        await newTicket.save();

        res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getAllTickets(req, res) {
    try {
        const tickets = await Ticket.find().populate('createdBy', 'name email');
        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateTicket(req, res) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket updated', ticket: updatedTicket });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteTicket(req, res) {
    try {
        const { id } = req.params;

        const deleted = await Ticket.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
