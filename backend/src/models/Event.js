const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    enum: ['conference', 'workshop', 'panel', 'networking', 'keynote', 'exhibition', 'social', 'other'],
    default: 'other',
    index: true
  },
  duration: {
    type: Number, // Duration in minutes
    default: 60
  },
  capacity: {
    type: Number,
    default: 100
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  speaker: {
    name: String,
    bio: String,
    photo: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Add text index for search functionality
eventSchema.index({
  title: 'text',
  description: 'text',
  'speaker.name': 'text',
  tags: 'text'
});

// Add compound indexes for common queries
eventSchema.index({ date: 1, category: 1 });
eventSchema.index({ location: 1, date: 1 });
eventSchema.index({ isActive: 1, date: 1 });

module.exports = mongoose.model('Event', eventSchema);
