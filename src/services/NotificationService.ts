import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  eventId?: string;
  announcementId?: string;
  type: 'event_reminder' | 'event_update' | 'announcement' | 'general';
  title: string;
  body: string;
}

class NotificationService {
  private expoPushToken: string | null = null;

  // Register for push notifications
  async registerForPushNotifications(): Promise<string | null> {
    let token = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }

      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        
        if (!projectId) {
          console.warn('Project ID not found');
        }

        token = (await Notifications.getExpoPushTokenAsync({
          projectId,
        })).data;
        
        this.expoPushToken = token;
        console.log('Push token:', token);
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    } else {
      console.warn('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Get current push token
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Schedule a local notification
  async scheduleLocalNotification(
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    data?: any
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger,
    });

    return notificationId;
  }

  // Schedule event reminder notification
  async scheduleEventReminder(
    eventId: string,
    eventTitle: string,
    eventDate: Date,
    reminderMinutes: number = 30
  ): Promise<string | null> {
    const reminderTime = new Date(eventDate.getTime() - (reminderMinutes * 60 * 1000));
    
    // Don't schedule if reminder time is in the past
    if (reminderTime <= new Date()) {
      console.warn('Reminder time is in the past, not scheduling notification');
      return null;
    }

    const notificationId = await this.scheduleLocalNotification(
      'Event Reminder',
      `${eventTitle} starts in ${reminderMinutes} minutes`,
      {
        date: reminderTime,
      },
      {
        eventId,
        type: 'event_reminder',
      }
    );

    return notificationId;
  }

  // Cancel a scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Handle notification received when app is in foreground
  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Handle notification tapped/clicked
  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Send push token to backend
  async sendPushTokenToBackend(token: string, userId: string): Promise<boolean> {
    try {
      // This would be implemented based on your backend API
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/push-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers as needed
        },
        body: JSON.stringify({
          userId,
          pushToken: token,
          platform: Platform.OS,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending push token to backend:', error);
      return false;
    }
  }

  // Present a notification immediately
  async presentNotificationNow(title: string, body: string, data?: any): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: null, // Show immediately
    });

    return notificationId;
  }

  // Check if notifications are enabled
  async areNotificationsEnabled(): Promise<boolean> {
    const settings = await Notifications.getPermissionsAsync();
    return settings.granted && settings.status === 'granted';
  }

  // Get notification settings
  async getNotificationSettings(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;

// Helper functions for common notification scenarios
export const NotificationHelpers = {
  // Schedule multiple event reminders (e.g., 1 hour and 15 minutes before)
  async scheduleMultipleEventReminders(
    eventId: string,
    eventTitle: string,
    eventDate: Date,
    reminderMinutes: number[] = [60, 15]
  ): Promise<string[]> {
    const notificationIds: string[] = [];

    for (const minutes of reminderMinutes) {
      const id = await notificationService.scheduleEventReminder(
        eventId,
        eventTitle,
        eventDate,
        minutes
      );
      if (id) {
        notificationIds.push(id);
      }
    }

    return notificationIds;
  },

  // Cancel all notifications for a specific event
  async cancelEventNotifications(eventId: string): Promise<void> {
    const scheduledNotifications = await notificationService.getScheduledNotifications();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.eventId === eventId) {
        await notificationService.cancelNotification(notification.identifier);
      }
    }
  },

  // Format notification time display
  formatNotificationTime(date: Date): string {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};
