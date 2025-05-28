import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, View as RNView } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import HelloWave from '../../components/HelloWave';
import { fetchEvents } from '../../api/events';

// Simple analytics/logging function
function logEvent(event: string, data?: any) {
  // Replace with real analytics integration as needed
  // eslint-disable-next-line no-console
  console.log(`[Analytics] ${event}`, data || '');
}

export default function HomeScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data);
      logEvent('EventsLoaded', { count: data.length });
    } catch (err) {
      const error = err as { message?: string };
      setError('Failed to load events. Please try again later.');
      logEvent('EventsLoadError', { error: error.message || err });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      role="main"
      accessible
      accessibilityLabel="Home screen"
    >
      <HelloWave />
      <ThemedText
        accessibilityRole="header"
        accessibilityLabel="Welcome to the Convention App!"
        style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}
      >
        Welcome to the Convention App!
      </ThemedText>
      {loading ? (
        <RNView
          accessible
          accessibilityLabel="Loading events"
        >
          <ActivityIndicator size="large" color="#007aff" />
          <ThemedText style={{ marginTop: 8 }}>Loading events...</ThemedText>
        </RNView>
      ) : error ? (
        <RNView
          accessible
          accessibilityRole="alert"
          accessibilityLabel={error}
        >
          <ThemedText style={{ color: '#ff3b30' }}>{error}</ThemedText>
        </RNView>
      ) : (
        <RNView
          accessible
          accessibilityRole="list"
          accessibilityLabel="Event list"
        >
          {events.length === 0 ? (
            <ThemedText>No events found.</ThemedText>
          ) : (
            events.map((event) => (
              <ThemedText
                key={event._id}
                style={{
                  marginVertical: 4,
                  color: '#007aff', // color contrast for accessibility
                }}
              >
                {event.title}
              </ThemedText>
            ))
          )}
        </RNView>
      )}
    </ThemedView>
  );
}
