const express = require('express');
const UserFavorite = require('../models/UserFavorite');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's favorite events
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await UserFavorite.find({ userId: req.user.id })
      .populate('eventId')
      .sort({ addedAt: -1 });

    const favoriteEvents = favorites
      .filter(fav => fav.eventId) // Filter out any null references
      .map(fav => ({
        ...fav.eventId.toObject(),
        favoriteId: fav._id,
        addedAt: fav.addedAt
      }));

    res.json(favoriteEvents);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add event to favorites
router.post('/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already favorited
    const existingFavorite = await UserFavorite.findOne({ userId, eventId });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Event already in favorites' });
    }

    // Create new favorite
    const favorite = new UserFavorite({ userId, eventId });
    await favorite.save();

    res.status(201).json({ 
      message: 'Event added to favorites',
      favoriteId: favorite._id 
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove event from favorites
router.delete('/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const favorite = await UserFavorite.findOneAndDelete({ userId, eventId });
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Event removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Check if event is favorited by user
router.get('/check/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const favorite = await UserFavorite.findOne({ userId, eventId });
    res.json({ 
      isFavorited: !!favorite,
      favoriteId: favorite ? favorite._id : null
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

module.exports = router;
