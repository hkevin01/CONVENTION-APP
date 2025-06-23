import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Announcement, fetchAnnouncements } from '../../api/announcements';
import { Event, fetchEvents } from '../../api/events';
import HelloWave from '../../components/HelloWave';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import useColorScheme from '../../hooks/useColorScheme';

// Simple analytics/logging function
function logEvent(event: string, data?: any) {
  // Replace with real analytics integration as needed
  // eslint-disable-next-line no-console
  console.log(`[Analytics] ${event}`, data || '');
}

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [eventsData, announcementsData] = await Promise.all([
        fetchEvents(),
        fetchAnnouncements(),
      ]);
      setEvents(eventsData.slice(0, 3)); // Show only first 3 events on home
      setAnnouncements(announcementsData.slice(0, 5)); // Show only first 5 announcements
      logEvent('HomeDataLoaded', { 
        eventsCount: eventsData.length,
        announcementsCount: announcementsData.length 
      });
    } catch (err) {
      const error = err as { message?: string };
      setError('Failed to load data. Please try again later.');
      logEvent('HomeDataLoadError', { error: error.message || err });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return Colors[colorScheme].error;
      case 'medium':
        return '#ff9500';
      case 'low':
      default:
        return Colors[colorScheme].primary;
    }
  };

  const renderAnnouncement = (announcement: Announcement) => (
    <ThemedView
      key={announcement._id}
      style={[
        styles.announcementCard,
        { 
          backgroundColor: Colors[colorScheme].card,
          borderLeftColor: getPriorityColor(announcement.priority),
        }
      ]}
    >
      <ThemedText style={styles.announcementTitle}>{announcement.title}</ThemedText>
      <ThemedText style={styles.announcementContent} numberOfLines={2}>
        {announcement.content}
      </ThemedText>
      <ThemedText style={styles.announcementDate}>
        {formatDate(announcement.createdAt)}
      </ThemedText>
    </ThemedView>
  );

  const renderUpcomingEvent = (event: Event) => (
    <TouchableOpacity
      key={event._id}
      style={[styles.eventCard, { backgroundColor: Colors[colorScheme].card }]}
      onPress={() => {
        router.push(`/event/${event._id}` as any);
      }}
    >
      <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
      <ThemedText style={styles.eventDate}>{formatDate(event.date)}</ThemedText>
      <ThemedText style={styles.eventLocation}>{event.location}</ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <HelloWave />
        <ActivityIndicator size="large" color={Colors[colorScheme].primary} style={styles.loader} />
        <ThemedText style={styles.loadingText}>Loading convention data...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme].primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <HelloWave />
          <ThemedText style={styles.welcomeTitle}>
            {user ? `Welcome back, ${user.name}!` : 'Welcome to ConventionApp'}
          </ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Stay updated with the latest convention news and events
          </ThemedText>
        </ThemedView>

        {error ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={[styles.errorText, { color: Colors[colorScheme].error }]}>
              {error}
            </ThemedText>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: Colors[colorScheme].primary }]}
              onPress={loadData}
            >
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <>
            {/* Announcements Section */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>📢 Latest Announcements</ThemedText>
              {announcements.length === 0 ? (
                <ThemedText style={styles.emptyText}>No announcements at this time</ThemedText>
              ) : (
                <ThemedView style={styles.announcementsContainer}>
                  {announcements.map(renderAnnouncement)}
                </ThemedView>
              )}
            </ThemedView>

            {/* Upcoming Events Section */}
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>📅 Upcoming Events</ThemedText>
              {events.length === 0 ? (
                <ThemedText style={styles.emptyText}>No upcoming events</ThemedText>
              ) : (
                <ThemedView style={styles.eventsContainer}>
                  {events.map(renderUpcomingEvent)}
                </ThemedView>
              )}
            </ThemedView>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  loader: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    padding: 20,
  },
  announcementsContainer: {
    gap: 12,
  },
  announcementCard: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  announcementContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  announcementDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    opacity: 0.8,
  },
  eventLocation: {
    fontSize: 14,
    opacity: 0.7,
  },
});
