const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  checkedIn: { type: Boolean, default: false },
});

module.exports = mongoose.model('Ticket', ticketSchema);
