import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Event } from '../api/events';

interface OfflineEvent extends Event {
  isOfflineOnly?: boolean;
  syncStatus: 'synced' | 'pending' | 'failed';
  lastSyncAttempt?: string;
}

interface OfflineEventData {
  events: OfflineEvent[];
  lastSync: string;
  metadata: {
    totalEvents: number;
    categories: string[];
    locations: string[];
  };
}

const OFFLINE_EVENTS_KEY = 'convention_app_offline_events';
const OFFLINE_FAVORITES_KEY = 'convention_app_offline_favorites';
const OFFLINE_ANNOUNCEMENTS_KEY = 'convention_app_offline_announcements';

/**
 * Enhanced offline cache specifically for events with advanced features
 */
export function useOfflineEvents() {
  const [offlineEvents, setOfflineEvents] = useState<OfflineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  
  /**
   * Load offline events from storage
   */
  const loadOfflineEvents = useCallback(async (): Promise<OfflineEvent[]> => {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_EVENTS_KEY);
      if (!stored) return [];

      const data: OfflineEventData = JSON.parse(stored);
      setLastSync(new Date(data.lastSync));
      return data.events;
    } catch (error) {
      console.error('Error loading offline events:', error);
      return [];
    }
  }, []);

  /**
   * Save events to offline storage
   */
  const saveOfflineEvents = useCallback(async (events: OfflineEvent[]): Promise<void> => {
    try {
      const categories = [...new Set(events.map(e => e.category).filter(Boolean))] as string[];
      const locations = [...new Set(events.map(e => e.location).filter(Boolean))] as string[];
      
      const data: OfflineEventData = {
        events,
        lastSync: new Date().toISOString(),
        metadata: {
          totalEvents: events.length,
          categories,
          locations,
        },
      };

      await AsyncStorage.setItem(OFFLINE_EVENTS_KEY, JSON.stringify(data));
      setOfflineEvents(events);
      setLastSync(new Date());
    } catch (error) {
      console.error('Error saving offline events:', error);
    }
  }, []);

  /**
   * Add an event to offline storage
   */
  const addOfflineEvent = useCallback(async (event: Event): Promise<void> => {
    const offlineEvent: OfflineEvent = {
      ...event,
      syncStatus: 'synced',
    };

    const currentEvents = await loadOfflineEvents();
    const existingIndex = currentEvents.findIndex(e => e._id === event._id);
    
    if (existingIndex >= 0) {
      currentEvents[existingIndex] = offlineEvent;
    } else {
      currentEvents.push(offlineEvent);
    }

    await saveOfflineEvents(currentEvents);
  }, [loadOfflineEvents, saveOfflineEvents]);

  /**
   * Remove an event from offline storage
   */
  const removeOfflineEvent = useCallback(async (eventId: string): Promise<void> => {
    const currentEvents = await loadOfflineEvents();
    const filteredEvents = currentEvents.filter(e => e._id !== eventId);
    await saveOfflineEvents(filteredEvents);
  }, [loadOfflineEvents, saveOfflineEvents]);

  /**
   * Mark event for offline availability
   */
  const markEventForOffline = useCallback(async (eventId: string): Promise<void> => {
    const currentEvents = await loadOfflineEvents();
    const eventIndex = currentEvents.findIndex(e => e._id === eventId);
    
    if (eventIndex >= 0) {
      currentEvents[eventIndex] = {
        ...currentEvents[eventIndex],
        isOfflineOnly: true,
        syncStatus: 'synced',
      };
      await saveOfflineEvents(currentEvents);
    }
  }, [loadOfflineEvents, saveOfflineEvents]);

  /**
   * Get offline events with filtering
   */
  const getOfflineEvents = useCallback((filters?: {
    category?: string;
    location?: string;
    search?: string;
    offlineOnly?: boolean;
  }): OfflineEvent[] => {
    let filteredEvents = [...offlineEvents];

    if (filters?.category) {
      filteredEvents = filteredEvents.filter(e => e.category === filters.category);
    }

    if (filters?.location) {
      filteredEvents = filteredEvents.filter(e => e.location === filters.location);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(e => 
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower) ||
        e.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.offlineOnly) {
      filteredEvents = filteredEvents.filter(e => e.isOfflineOnly);
    }

    return filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [offlineEvents]);

  /**
   * Sync offline events with server
   */
  const syncOfflineEvents = useCallback(async (
    fetchFunction: () => Promise<Event[]>
  ): Promise<void> => {
    setSyncStatus('syncing');
    
    try {
      const serverEvents = await fetchFunction();
      const offlineEvents = await loadOfflineEvents();
      
      // Merge server events with offline-only events
      const mergedEvents: OfflineEvent[] = serverEvents.map(event => {
        const existingOffline = offlineEvents.find(e => e._id === event._id);
        return {
          ...event,
          isOfflineOnly: existingOffline?.isOfflineOnly || false,
          syncStatus: 'synced' as const,
        };
      });

      // Add offline-only events that don't exist on server
      const offlineOnlyEvents = offlineEvents.filter(e => 
        e.isOfflineOnly && !serverEvents.find(se => se._id === e._id)
      );
      
      mergedEvents.push(...offlineOnlyEvents);
      
      await saveOfflineEvents(mergedEvents);
      setSyncStatus('idle');
    } catch (error) {
      console.error('Error syncing offline events:', error);
      setSyncStatus('error');
      throw error;
    }
  }, [loadOfflineEvents, saveOfflineEvents]);

  /**
   * Clear all offline events
   */
  const clearOfflineEvents = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(OFFLINE_EVENTS_KEY);
      setOfflineEvents([]);
      setLastSync(null);
    } catch (error) {
      console.error('Error clearing offline events:', error);
    }
  }, []);

  /**
   * Get storage statistics
   */
  const getStorageStats = useCallback(async () => {
    try {
      const events = await loadOfflineEvents();
      const eventsSize = JSON.stringify(events).length;
      
      return {
        totalEvents: events.length,
        offlineOnlyEvents: events.filter(e => e.isOfflineOnly).length,
        storageSize: eventsSize,
        lastSync,
        categories: [...new Set(events.map(e => e.category).filter(Boolean))] as string[],
        locations: [...new Set(events.map(e => e.location).filter(Boolean))] as string[],
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  }, [loadOfflineEvents, lastSync]);

  // Initialize on mount
  useEffect(() => {
    loadOfflineEvents().then(events => {
      setOfflineEvents(events);
      setIsLoading(false);
    });
  }, [loadOfflineEvents]);

  return {
    offlineEvents,
    isLoading,
    lastSync,
    syncStatus,
    addOfflineEvent,
    removeOfflineEvent,
    markEventForOffline,
    getOfflineEvents,
    syncOfflineEvents,
    clearOfflineEvents,
    getStorageStats,
    refresh: loadOfflineEvents,
  };
}

/**
 * Hook for managing offline favorites
 */
export function useOfflineFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = useCallback(async (): Promise<string[]> => {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading offline favorites:', error);
      return [];
    }
  }, []);

  const saveFavorites = useCallback(async (favs: string[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(OFFLINE_FAVORITES_KEY, JSON.stringify(favs));
      setFavorites(favs);
    } catch (error) {
      console.error('Error saving offline favorites:', error);
    }
  }, []);

  const addFavorite = useCallback(async (eventId: string): Promise<void> => {
    const current = await loadFavorites();
    if (!current.includes(eventId)) {
      await saveFavorites([...current, eventId]);
    }
  }, [loadFavorites, saveFavorites]);

  const removeFavorite = useCallback(async (eventId: string): Promise<void> => {
    const current = await loadFavorites();
    await saveFavorites(current.filter(id => id !== eventId));
  }, [loadFavorites, saveFavorites]);

  const isFavorite = useCallback((eventId: string): boolean => {
    return favorites.includes(eventId);
  }, [favorites]);

  useEffect(() => {
    loadFavorites().then(setFavorites);
  }, [loadFavorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites: () => saveFavorites([]),
  };
}

/**
 * Utility functions for offline cache management
 */
export const OfflineCacheUtils = {
  async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('convention_app_'));
      const items = await AsyncStorage.multiGet(appKeys);
      return items.reduce((total, [, value]) => total + (value?.length || 0), 0);
    } catch (error) {
      console.error('Error getting storage size:', error);
      return 0;
    }
  },

  async clearAllCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('convention_app_'));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  },

  formatStorageSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};
