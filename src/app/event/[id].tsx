import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Event, fetchEventById } from '../../api/events';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!id) {
      setError('Event ID not provided');
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setError(null);
        const eventData = await fetchEventById(id);
        setEvent(eventData);
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Failed to load event details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } catch {
      return { date: dateString, time: '' };
    }
  };

  const handleGetTicket = () => {
    if (!event) return;
    
    // TODO: Implement ticket booking functionality
    Alert.alert(
      'Get Ticket',
      `Would you like to get a ticket for "${event.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Get Ticket', 
          onPress: () => {
            // Navigate to ticket booking or external URL
            Alert.alert('Coming Soon', 'Ticket booking functionality will be available soon!');
          }
        },
      ]
    );
  };

  const handleShare = () => {
    if (!event) return;
    
    // TODO: Implement share functionality
    Alert.alert('Share Event', 'Share functionality coming soon!');
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
        <ThemedText style={styles.loadingText}>Loading event details...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !event) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={[styles.errorText, { color: Colors[colorScheme].error }]}>
          {error || 'Event not found'}
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].primary }]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const { date, time } = formatDate(event.date);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>{event.title}</ThemedText>
          <ThemedView style={styles.dateTimeContainer}>
            <ThemedText style={styles.date}>{date}</ThemedText>
            {time && <ThemedText style={styles.time}>{time}</ThemedText>}
          </ThemedView>
          <ThemedText style={styles.location}>📍 {event.location}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About This Event</ThemedText>
          <ThemedText style={styles.description}>{event.description}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Event Details</ThemedText>
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Date:</ThemedText>
            <ThemedText style={styles.detailValue}>{date}</ThemedText>
          </ThemedView>
          {time && (
            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Time:</ThemedText>
              <ThemedText style={styles.detailValue}>{time}</ThemedText>
            </ThemedView>
          )}
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Location:</ThemedText>
            <ThemedText style={styles.detailValue}>{event.location}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: Colors[colorScheme].primary }]}
            onPress={handleGetTicket}
          >
            <ThemedText style={styles.primaryButtonText}>Get Ticket</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: Colors[colorScheme].border }]}
            onPress={handleShare}
          >
            <ThemedText style={[styles.secondaryButtonText, { color: Colors[colorScheme].primary }]}>
              Share Event
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 34,
  },
  dateTimeContainer: {
    marginBottom: 8,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    opacity: 0.8,
  },
  location: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    width: 80,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
  actionButtons: {
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
