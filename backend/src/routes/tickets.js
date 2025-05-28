const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

router.post('/checkin', async (req, res) => {
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  ticket.checkedIn = true;
  await ticket.save();
  res.json({ message: 'Checked in', ticket });
});

module.exports = router;
