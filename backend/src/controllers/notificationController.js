const User = require('../models/User');
const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Save user's push token
 */
const savePushToken = async (req, res) => {
  try {
    const { pushToken, platform } = req.body;
    const userId = req.user.id;

    // Validate push token
    if (!Expo.isExpoPushToken(pushToken)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid push token format'
      });
    }

    // Update user with push token
    await User.findByIdAndUpdate(userId, {
      pushToken,
      platform,
      pushTokenUpdated: new Date()
    });

    res.json({
      success: true,
      message: 'Push token saved successfully'
    });
  } catch (error) {
    console.error('Error saving push token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save push token'
    });
  }
};

/**
 * Send push notification to specific user
 */
const sendNotificationToUser = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findById(userId).select('pushToken');
    
    if (!user || !user.pushToken) {
      console.warn(`No push token found for user ${userId}`);
      return false;
    }

    const message = {
      to: user.pushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    return tickets;
  } catch (error) {
    console.error('Error sending notification to user:', error);
    return false;
  }
};

/**
 * Send push notification to multiple users
 */
const sendNotificationToUsers = async (userIds, title, body, data = {}) => {
  try {
    const users = await User.find({
      _id: { $in: userIds },
      pushToken: { $exists: true, $ne: null }
    }).select('pushToken');

    if (users.length === 0) {
      console.warn('No users with push tokens found');
      return [];
    }

    const messages = users.map(user => ({
      to: user.pushToken,
      sound: 'default',
      title,
      body,
      data,
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    return tickets;
  } catch (error) {
    console.error('Error sending notifications to users:', error);
    return [];
  }
};

/**
 * Send notification to all users
 */
const sendNotificationToAll = async (title, body, data = {}) => {
  try {
    const users = await User.find({
      pushToken: { $exists: true, $ne: null }
    }).select('pushToken');

    if (users.length === 0) {
      console.warn('No users with push tokens found');
      return [];
    }

    const messages = users.map(user => ({
      to: user.pushToken,
      sound: 'default',
      title,
      body,
      data,
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    return tickets;
  } catch (error) {
    console.error('Error sending notifications to all users:', error);
    return [];
  }
};

/**
 * Send event reminder notifications
 */
const sendEventReminders = async (req, res) => {
  try {
    const { eventId, reminderType } = req.body;
    
    const Event = require('../models/Event');
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    let title, body;
    switch (reminderType) {
      case '1hour':
        title = 'Event Starting Soon!';
        body = `${event.title} starts in 1 hour`;
        break;
      case '15min':
        title = 'Event Starting Soon!';
        body = `${event.title} starts in 15 minutes`;
        break;
      case 'now':
        title = 'Event Starting Now!';
        body = `${event.title} is starting now`;
        break;
      default:
        title = 'Event Reminder';
        body = `Don't forget about ${event.title}`;
    }

    // For now, send to all users. In production, you'd send only to users who favorited the event
    const tickets = await sendNotificationToAll(title, body, {
      eventId,
      type: 'event_reminder',
      screen: 'event',
    });

    res.json({
      success: true,
      message: 'Event reminders sent',
      ticketsCount: tickets.length
    });
  } catch (error) {
    console.error('Error sending event reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send event reminders'
    });
  }
};

/**
 * Send announcement notifications
 */
const sendAnnouncementNotification = async (req, res) => {
  try {
    const { title, message, priority = 'normal' } = req.body;

    const notificationTitle = priority === 'urgent' ? `🚨 ${title}` : title;
    
    const tickets = await sendNotificationToAll(notificationTitle, message, {
      type: 'announcement',
      priority,
      screen: 'announcements',
    });

    res.json({
      success: true,
      message: 'Announcement notification sent',
      ticketsCount: tickets.length
    });
  } catch (error) {
    console.error('Error sending announcement notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send announcement notification'
    });
  }
};

/**
 * Test notification endpoint
 */
const testNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const tickets = await sendNotificationToUser(
      userId,
      'Test Notification',
      'This is a test notification from the Convention App!',
      { type: 'test' }
    );

    res.json({
      success: true,
      message: 'Test notification sent',
      tickets
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification'
    });
  }
};

/**
 * Handle notification receipts (optional - for delivery tracking)
 */
const handleNotificationReceipts = async (req, res) => {
  try {
    const { receiptIds } = req.body;
    
    if (!Array.isArray(receiptIds) || receiptIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Receipt IDs array is required'
      });
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    const receipts = [];

    for (let chunk of receiptIdChunks) {
      try {
        const receiptChunk = await expo.getPushNotificationReceiptsAsync(chunk);
        receipts.push(receiptChunk);
      } catch (error) {
        console.error('Error getting push notification receipts:', error);
      }
    }

    res.json({
      success: true,
      receipts
    });
  } catch (error) {
    console.error('Error handling notification receipts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle notification receipts'
    });
  }
};

module.exports = {
  savePushToken,
  sendNotificationToUser,
  sendNotificationToUsers,
  sendNotificationToAll,
  sendEventReminders,
  sendAnnouncementNotification,
  testNotification,
  handleNotificationReceipts,
};
