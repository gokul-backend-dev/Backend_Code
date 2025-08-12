const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['open', 'assigned', 'closed'], default: 'open' }
});

module.exports = mongoose.model('Ticket', TicketSchema);
