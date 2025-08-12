import Ticket from '../modules/tickets.js';

export async function createTicket(req, res) {
    try {
        const { title, description, assignedTo, priority, status } = req.body;

        if (!title || !description || !assignedTo || !priority || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const createdBy = req.user._id;

        const existing = await Ticket.findOne({ title });
        if (existing) {
            return res.status(400).json({ message: 'Ticket with this title already exists' });
        }

        const newTicket = new Ticket({ title, description, assignedTo, priority, status, createdBy });

        await newTicket.save();

        res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getAllTickets(req, res) {
    try {
        const tickets = await Ticket.find().populate([{ path: "assignedTo", select: "name" }, { path: "createdBy", select: "name" }]);
        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateTicket(req, res) {
    try {
        const { id } = req.params;
        const { title, description, assignedTo, priority, status } = req.body;

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { title, description, assignedTo, priority, status },
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

export async function viewTicket(req, res) {
    try {
        const id = req.params.id;
        console.log("🚀 ~ viewTicket ~ req.params:", req.params)

        const ticketRecord = await Ticket.findById(id)
        console.log("🚀 ~ viewTicket ~ ticketRecord:", ticketRecord)

        if (!ticketRecord) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket get successfully', ticket: ticketRecord });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteTicket(req, res) {
    try {
        const id = req.params.id;

        const deleted = await Ticket.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function dashboard(req, res) {
    try {

        const statusCounts = await Ticket.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log("🚀 ~ dashboard ~ statusCounts:", statusCounts)

        const counts = {
            totalTickets: 0,
            open: 0,
            inprogress: 0,
            closed: 0,
            reopen: 0
        };

        statusCounts.forEach(item => {
            counts[item._id] = item.count;
            counts.totalTickets += item.count;
        });

        const userTicketCount = await Ticket.distinct("createdBy");

        res.status(200).json({
            totalTickets: counts.totalTickets,
            openTickets: counts.open,
            inProgressTickets: counts.inprogress,
            completedTickets: counts.closed,
            reopenTickets: counts.reopen,
            totalUserTicketCount: userTicketCount.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};




