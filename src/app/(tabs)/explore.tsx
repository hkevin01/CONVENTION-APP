import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {
    Event,
    EventFilters,
    EventsResponse,
    fetchEventCategories,
    fetchEventLocations,
    fetchEventsWithPagination
} from '../../api/events';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { useOfflineCache } from '../../hooks/useOfflineCache';

export default function ExploreScreen() {
  const [eventsData, setEventsData] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: '',
    location: '',
    sortBy: 'date',
    sortOrder: 'asc',
    page: 1,
    limit: 20
  });

  const colorScheme = useColorScheme();

  // Cache for events
  const eventsCache = useOfflineCache<Event[]>({
    key: 'convention_app_events',
    ttl: 5 * 60 * 1000, // 5 minutes
    fallbackData: []
  });

  const loadFilterOptions = useCallback(async () => {
    try {
      const [categoriesData, locationsData] = await Promise.all([
        fetchEventCategories(),
        fetchEventLocations()
      ]);
      setCategories(categoriesData);
      setLocations(locationsData);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  }, []);

  const loadEvents = useCallback(async (searchFilters?: EventFilters, isRefresh = false) => {
    try {
      setError(null);
      const currentFilters = searchFilters || filters;
      
      if (isRefresh) {
        // For refresh, always fetch fresh data
        const data = await fetchEventsWithPagination(currentFilters);
        setEventsData(data);
        await eventsCache.saveToCache(data.events);
      } else {
        // Try cache first, then fetch if needed
        const data = await eventsCache.fetchData(
          () => fetchEventsWithPagination(currentFilters).then(d => d.events)
        );
        
        // If we got cached data, create a basic response structure
        if (data) {
          setEventsData({
            events: data,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalEvents: data.length,
              hasNext: false,
              hasPrev: false,
            },
            filters: currentFilters
          });
        }
      }
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, eventsCache]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents(filters, true);
  }, [loadEvents, filters]);

  const handleSearch = useCallback(() => {
    setLoading(true);
    loadEvents(filters, true);
  }, [loadEvents, filters]);

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      category: '',
      location: '',
      sortBy: 'date' as const,
      sortOrder: 'asc' as const,
      page: 1,
      limit: 20
    };
    setFilters(clearedFilters);
    setLoading(true);
    loadEvents(clearedFilters, true);
  }, [loadEvents]);

  useEffect(() => {
    loadEvents();
    loadFilterOptions();
  }, [loadFilterOptions]);

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

  const getCategoryColor = (category: string) => {
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

  const renderEvent = ({ item: event }: { item: Event }) => (
    <TouchableOpacity
      style={[styles.eventCard, { 
        backgroundColor: Colors[colorScheme].card, 
        borderColor: Colors[colorScheme].border 
      }]}
      onPress={() => {
        router.push(`/event/${event._id}` as any);
      }}
    >
      <View style={styles.eventHeader}>
        <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
        {event.category && (
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
            <ThemedText style={styles.categoryText}>{event.category}</ThemedText>
          </View>
        )}
      </View>
      <ThemedText style={styles.eventDate}>{formatDate(event.date)}</ThemedText>
      <ThemedText style={styles.eventLocation}>📍 {event.location}</ThemedText>
      <ThemedText style={styles.eventDescription} numberOfLines={2}>
        {event.description}
      </ThemedText>
      {event.speaker && (
        <ThemedText style={styles.speakerText}>
          🎤 Speaker: {event.speaker.name}
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <ThemedView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <ThemedText style={styles.modalCloseButton}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.modalTitle}>Filter Events</ThemedText>
          <TouchableOpacity onPress={() => {
            handleSearch();
            setShowFilters(false);
          }}>
            <ThemedText style={[styles.modalApplyButton, { color: Colors[colorScheme].primary }]}>
              Apply
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Category Filter */}
          <ThemedText style={styles.filterLabel}>Category</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                { borderColor: Colors[colorScheme].border },
                filters.category === '' && { backgroundColor: Colors[colorScheme].primary }
              ]}
              onPress={() => setFilters(prev => ({ ...prev, category: '' }))}
            >
              <ThemedText style={[
                styles.filterChipText,
                filters.category === '' && { color: '#ffffff' }
              ]}>
                All
              </ThemedText>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  { borderColor: Colors[colorScheme].border },
                  filters.category === category && { backgroundColor: Colors[colorScheme].primary }
                ]}
                onPress={() => setFilters(prev => ({ ...prev, category }))}
              >
                <ThemedText style={[
                  styles.filterChipText,
                  filters.category === category && { color: '#ffffff' }
                ]}>
                  {category}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Location Filter */}
          <ThemedText style={styles.filterLabel}>Location</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                { borderColor: Colors[colorScheme].border },
                filters.location === '' && { backgroundColor: Colors[colorScheme].primary }
              ]}
              onPress={() => setFilters(prev => ({ ...prev, location: '' }))}
            >
              <ThemedText style={[
                styles.filterChipText,
                filters.location === '' && { color: '#ffffff' }
              ]}>
                All
              </ThemedText>
            </TouchableOpacity>
            {locations.map((location) => (
              <TouchableOpacity
                key={location}
                style={[
                  styles.filterChip,
                  { borderColor: Colors[colorScheme].border },
                  filters.location === location && { backgroundColor: Colors[colorScheme].primary }
                ]}
                onPress={() => setFilters(prev => ({ ...prev, location }))}
              >
                <ThemedText style={[
                  styles.filterChipText,
                  filters.location === location && { color: '#ffffff' }
                ]}>
                  {location}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort Options */}
          <ThemedText style={styles.filterLabel}>Sort By</ThemedText>
          <View style={styles.sortContainer}>
            {[
              { key: 'date', label: 'Date' },
              { key: 'title', label: 'Title' },
              { key: 'location', label: 'Location' }
            ].map((sort) => (
              <TouchableOpacity
                key={sort.key}
                style={[
                  styles.sortOption,
                  { borderColor: Colors[colorScheme].border },
                  filters.sortBy === sort.key && { backgroundColor: Colors[colorScheme].primary }
                ]}
                onPress={() => setFilters(prev => ({ ...prev, sortBy: sort.key as any }))}
              >
                <ThemedText style={[
                  styles.sortOptionText,
                  filters.sortBy === sort.key && { color: '#ffffff' }
                ]}>
                  {sort.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.clearFiltersButton, { borderColor: Colors[colorScheme].error }]}
            onPress={clearFilters}
          >
            <ThemedText style={[styles.clearFiltersText, { color: Colors[colorScheme].error }]}>
              Clear All Filters
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </Modal>
  );

  if (loading && !eventsData) {
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
      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: Colors[colorScheme].card,
              borderColor: Colors[colorScheme].border,
              color: Colors[colorScheme].text
            }
          ]}
          placeholder="Search events..."
          placeholderTextColor={Colors[colorScheme].text + '80'}
          value={filters.search}
          onChangeText={(text) => setFilters(prev => ({ ...prev, search: text }))}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: Colors[colorScheme].primary }]}
          onPress={() => setShowFilters(true)}
        >
          <ThemedText style={styles.filterButtonText}>Filters</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={eventsData?.events || []}
        renderItem={renderEvent}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme].primary}
          />
        }
        ListHeaderComponent={
          <ThemedText style={styles.title}>
            Convention Events
            {eventsData?.pagination.totalEvents ? ` (${eventsData.pagination.totalEvents})` : ''}
          </ThemedText>
        }
        ListEmptyComponent={
          error ? (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={[styles.errorText, { color: Colors[colorScheme].error }]}>
                {error}
              </ThemedText>
              <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: Colors[colorScheme].primary }]}
                onPress={() => loadEvents(filters, true)}
              >
                <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No events found</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Try adjusting your search or filters
              </ThemedText>
            </ThemedView>
          )
        }
        showsVerticalScrollIndicator={false}
      />

      {renderFilterModal()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
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
  eventCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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
    marginBottom: 8,
  },
  speakerText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCloseButton: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalApplyButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  filterChips: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearFiltersButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 24,
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
