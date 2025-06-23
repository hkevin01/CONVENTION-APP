import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Event, fetchEvents } from '../../api/events';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function ExploreScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const renderEvent = (event: Event) => (
    <TouchableOpacity
      key={event._id}
      style={[styles.eventCard, { backgroundColor: Colors[colorScheme].card, borderColor: Colors[colorScheme].border }]}
      onPress={() => {
        router.push(`/event/${event._id}` as any);
      }}
    >
      <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
      <ThemedText style={styles.eventDate}>{formatDate(event.date)}</ThemedText>
      <ThemedText style={styles.eventLocation}>{event.location}</ThemedText>
      <ThemedText style={styles.eventDescription} numberOfLines={2}>
        {event.description}
      </ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
          <ThemedText style={styles.loadingText}>Loading events...</ThemedText>
        </ThemedView>
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
        <ThemedText style={styles.title}>Convention Events</ThemedText>
        
        {error ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={[styles.errorText, { color: Colors[colorScheme].error }]}>
              {error}
            </ThemedText>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: Colors[colorScheme].primary }]}
              onPress={loadEvents}
            >
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : events.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No events available</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Check back later for new events!
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.eventsContainer}>
            {events.map(renderEvent)}
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
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
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  eventsContainer: {
    gap: 16,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.8,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
