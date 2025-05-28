const express = require('express');
const Announcement = require('../models/Announcement');
const router = express.Router();

router.get('/', async (req, res) => {
  const announcements = await Announcement.find();
  res.json(announcements);
});

router.post('/', async (req, res) => {
  const announcement = new Announcement(req.body);
  await announcement.save();
  res.status(201).json(announcement);
});

module.exports = router;
