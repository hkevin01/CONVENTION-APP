import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Event, fetchEventById } from '../../api/events';
import {
    addToFavorites,
    checkFavoriteStatus,
    removeFromFavorites
} from '../../api/favorites';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import useColorScheme from '../../hooks/useColorScheme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) {
      setError('Event ID not provided');
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setError(null);
        const [eventData, favoriteStatus] = await Promise.all([
          fetchEventById(id),
          user ? checkFavoriteStatus(id) : Promise.resolve({ isFavorited: false, favoriteId: null })
        ]);
        
        setEvent(eventData);
        setIsFavorited(favoriteStatus.isFavorited);
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Failed to load event details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, user]);

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

  const getCategoryColor = (category?: string) => {
    if (!category) return Colors[colorScheme].text;
    
    const categoryColors: { [key: string]: string } = {
      conference: '#007aff',
      workshop: '#34c759',
      panel: '#ff9500',
      networking: '#af52de',
      keynote: '#ff3b30',
      exhibition: '#00d4ff',
      social: '#ff2d92',
      other: Colors[colorScheme].text
    };
    return categoryColors[category] || Colors[colorScheme].text;
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to save favorites');
      return;
    }

    if (!event) return;

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await removeFromFavorites(event._id);
        setIsFavorited(false);
      } else {
        await addToFavorites(event._id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleGetTicket = () => {
    if (!event) return;
    
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
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{event.title}</ThemedText>
            {user && (
              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  { 
                    backgroundColor: isFavorited ? Colors[colorScheme].error : 'transparent',
                    borderColor: Colors[colorScheme].error 
                  }
                ]}
                onPress={handleFavoriteToggle}
                disabled={favoriteLoading}
              >
                <ThemedText style={[
                  styles.favoriteButtonText,
                  { color: isFavorited ? '#ffffff' : Colors[colorScheme].error }
                ]}>
                  {favoriteLoading ? '...' : isFavorited ? '♥' : '♡'}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {event.category && (
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
              <ThemedText style={styles.categoryText}>{event.category}</ThemedText>
            </View>
          )}

          <ThemedView style={styles.dateTimeContainer}>
            <ThemedText style={styles.date}>{date}</ThemedText>
            {time && <ThemedText style={styles.time}>{time}</ThemedText>}
          </ThemedView>
          <ThemedText style={styles.location}>📍 {event.location}</ThemedText>
          
          {event.duration && (
            <ThemedText style={styles.duration}>
              ⏱️ Duration: {event.duration} minutes
            </ThemedText>
          )}

          {event.capacity && (
            <ThemedText style={styles.capacity}>
              👥 Capacity: {event.registeredCount || 0}/{event.capacity}
            </ThemedText>
          )}
        </ThemedView>

        {event.speaker && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Speaker</ThemedText>
            <ThemedText style={styles.speakerName}>🎤 {event.speaker.name}</ThemedText>
            {event.speaker.bio && (
              <ThemedText style={styles.speakerBio}>{event.speaker.bio}</ThemedText>
            )}
          </ThemedView>
        )}

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About This Event</ThemedText>
          <ThemedText style={styles.description}>{event.description}</ThemedText>
        </ThemedView>

        {event.tags && event.tags.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Tags</ThemedText>
            <View style={styles.tagsContainer}>
              {event.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: Colors[colorScheme].border }]}
                >
                  <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>
        )}

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
          {event.category && (
            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Category:</ThemedText>
              <ThemedText style={styles.detailValue}>{event.category}</ThemedText>
            </ThemedView>
          )}
          {event.priority && (
            <ThemedView style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Priority:</ThemedText>
              <ThemedText style={[
                styles.detailValue,
                { color: event.priority === 'high' ? Colors[colorScheme].error : Colors[colorScheme].text }
              ]}>
                {event.priority.toUpperCase()}
              </ThemedText>
            </ThemedView>
          )}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
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
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  capacity: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  speakerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  speakerBio: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    width: 100,
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
