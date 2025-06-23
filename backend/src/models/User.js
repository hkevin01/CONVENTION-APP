const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  // Push notification fields
  pushToken: { type: String },
  platform: { type: String, enum: ['ios', 'android', 'web'] },
  pushTokenUpdated: { type: Date },
  notificationPreferences: {
    eventReminders: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
    eventUpdates: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false },
  },
  // Profile fields
  bio: String,
  avatar: String,
  phone: String,
  company: String,
  title: String,
  interests: [String],
  // Settings
  settings: {
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    timezone: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
