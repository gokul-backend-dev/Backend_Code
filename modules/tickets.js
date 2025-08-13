import mongoose from 'mongoose';

const Tickets = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: String,
    status: { type: String, enum: ['open', 'inprogress', 'completed', 'reopen'], default: 'open' }
}, {
    timestamps: true
});


const Ticket = mongoose.model('Ticket', Tickets);
export default Ticket;
