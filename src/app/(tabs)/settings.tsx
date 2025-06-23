import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import useColorScheme from '../../hooks/useColorScheme';
import { OfflineCacheUtils } from '../../hooks/useEnhancedOfflineCache';
import notificationService from '../../services/NotificationService';

interface NotificationSettings {
  eventReminders: boolean;
  announcements: boolean;
  eventUpdates: boolean;
  marketing: boolean;
}

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [cacheSize, setCacheSize] = useState<string>('0 B');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    eventReminders: true,
    announcements: true,
    eventUpdates: true,
    marketing: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load cache size
      const size = await OfflineCacheUtils.getStorageSize();
      setCacheSize(OfflineCacheUtils.formatStorageSize(size));

      // Check notification permissions
      const enabled = await notificationService.areNotificationsEnabled();
      setNotificationsEnabled(enabled);

      // Load notification settings from backend or AsyncStorage
      // For now, using default settings
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all offline data including saved events and announcements. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await OfflineCacheUtils.clearAllCache();
              await loadSettings();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleNotificationPermission = async () => {
    try {
      if (!notificationsEnabled) {
        const token = await notificationService.registerForPushNotifications();
        if (token) {
          setNotificationsEnabled(true);
          Alert.alert('Success', 'Notifications enabled successfully');
        } else {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings'
          );
        }
      } else {
        Alert.alert(
          'Notifications',
          'To disable notifications, please go to your device settings'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to enable notifications');
    }
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.presentNotificationNow(
        'Test Notification',
        'This is a test notification from the Convention App!'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    // Here you would also save to backend/AsyncStorage
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch',
    onPress 
  }: {
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button' | 'info';
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: Colors[colorScheme].border }]}
      onPress={type === 'button' ? onPress : undefined}
      disabled={type === 'switch' || type === 'info'}
    >
      <View style={styles.settingContent}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={[styles.settingSubtitle, { color: Colors[colorScheme].text + '80' }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors[colorScheme].border, true: Colors[colorScheme].tint }}
          thumbColor={value ? '#FFFFFF' : Colors[colorScheme].text}
        />
      )}
      {type === 'button' && (
        <ThemedText style={[styles.chevron, { color: Colors[colorScheme].text + '60' }]}>
          ›
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>Profile</ThemedText>
          
          <SettingItem
            title={user?.name || 'User'}
            subtitle={user?.email}
            type="info"
          />
          
          <SettingItem
            title="Edit Profile"
            subtitle="Update your personal information"
            type="button"
            onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available in the next update')}
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>Notifications</ThemedText>
          
          <SettingItem
            title="Push Notifications"
            subtitle={notificationsEnabled ? 'Enabled' : 'Disabled'}
            value={notificationsEnabled}
            onValueChange={handleNotificationPermission}
          />
          
          {notificationsEnabled && (
            <>
              <SettingItem
                title="Event Reminders"
                subtitle="Get notified before events start"
                value={notificationSettings.eventReminders}
                onValueChange={(value) => updateNotificationSetting('eventReminders', value)}
              />
              
              <SettingItem
                title="Announcements"
                subtitle="Receive important announcements"
                value={notificationSettings.announcements}
                onValueChange={(value) => updateNotificationSetting('announcements', value)}
              />
              
              <SettingItem
                title="Event Updates"
                subtitle="Get notified about event changes"
                value={notificationSettings.eventUpdates}
                onValueChange={(value) => updateNotificationSetting('eventUpdates', value)}
              />
              
              <SettingItem
                title="Marketing"
                subtitle="Promotional content and newsletters"
                value={notificationSettings.marketing}
                onValueChange={(value) => updateNotificationSetting('marketing', value)}
              />

              <SettingItem
                title="Test Notification"
                subtitle="Send a test notification"
                type="button"
                onPress={handleTestNotification}
              />
            </>
          )}
        </View>

        {/* Data & Storage Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>Data & Storage</ThemedText>
          
          <SettingItem
            title="Cache Size"
            subtitle={`${cacheSize} of offline data stored`}
            type="info"
          />
          
          <SettingItem
            title="Offline Events"
            subtitle="Manage events available offline"
            type="button"
            onPress={() => Alert.alert('Coming Soon', 'Offline event management will be available in the next update')}
          />
          
          <SettingItem
            title="Clear Cache"
            subtitle="Remove all offline data"
            type="button"
            onPress={handleClearCache}
          />
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>App Settings</ThemedText>
          
          <SettingItem
            title="Dark Mode"
            subtitle="Use dark theme"
            value={colorScheme === 'dark'}
            onValueChange={() => {
              // Toggle theme - this would need to be implemented in your theme context
              Alert.alert('Info', 'Theme switching will be available in the next update');
            }}
          />
          
          <SettingItem
            title="Privacy Policy"
            type="button"
            onPress={() => Alert.alert('Privacy Policy', 'Your privacy is important to us. We collect minimal data necessary for app functionality.')}
          />
          
          <SettingItem
            title="Terms of Service"
            type="button"
            onPress={() => Alert.alert('Terms of Service', 'By using this app, you agree to our terms of service.')}
          />
          
          <SettingItem
            title="About"
            subtitle="Version 1.0.0"
            type="button"
            onPress={() => Alert.alert('About', 'Convention App v1.0.0\n\nBuilt with React Native and Expo\nDesigned for ConventionCatCorp')}
          />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>Account</ThemedText>
          
          <TouchableOpacity
            style={[styles.settingItem, styles.logoutButton]}
            onPress={handleLogout}
            disabled={loading}
          >
            <View style={styles.settingContent}>
              {loading ? (
                <ActivityIndicator color={Colors[colorScheme].error} />
              ) : (
                <ThemedText style={[styles.settingTitle, { color: Colors[colorScheme].error }]}>
                  Logout
                </ThemedText>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
  logoutButton: {
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  footer: {
    height: 40,
  },
});
