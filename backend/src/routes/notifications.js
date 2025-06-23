const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  savePushToken,
  sendEventReminders,
  sendAnnouncementNotification,
  testNotification,
  handleNotificationReceipts,
} = require('../controllers/notificationController');

// Save user's push token
router.post('/push-token', auth, savePushToken);

// Send event reminder notifications
router.post('/event-reminders', auth, sendEventReminders);

// Send announcement notification
router.post('/announcements', auth, sendAnnouncementNotification);

// Send test notification to current user
router.post('/test', auth, testNotification);

// Handle notification receipts
router.post('/receipts', auth, handleNotificationReceipts);

module.exports = router;
