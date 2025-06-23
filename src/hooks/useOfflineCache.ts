import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

interface CacheOptions {
  key: string;
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  fallbackData?: any;
}

interface CacheData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Hook for caching data with AsyncStorage
 * Provides offline support and reduces API calls
 */
export function useOfflineCache<T>(options: CacheOptions) {
  const { key, ttl = 5 * 60 * 1000, fallbackData = null } = options;
  const [cachedData, setCachedData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Load data from cache
   */
  const loadFromCache = useCallback(async (): Promise<T | null> => {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) {
        return fallbackData;
      }

      const parsedCache: CacheData<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - parsedCache.timestamp > parsedCache.ttl) {
        await AsyncStorage.removeItem(key);
        return fallbackData;
      }

      setLastUpdated(new Date(parsedCache.timestamp));
      return parsedCache.data;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return fallbackData;
    }
  }, [key, ttl, fallbackData]);

  /**
   * Save data to cache
   */
  const saveToCache = useCallback(async (data: T): Promise<void> => {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
      setCachedData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }, [key, ttl]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
      setCachedData(fallbackData);
      setLastUpdated(null);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [key, fallbackData]);

  /**
   * Fetch data with caching logic
   */
  const fetchData = useCallback(async (fetchFunction: () => Promise<T>, forceRefresh = false): Promise<T> => {
    setIsLoading(true);

    try {
      // If not forcing refresh, try to load from cache first
      if (!forceRefresh) {
        const cached = await loadFromCache();
        if (cached !== null) {
          setCachedData(cached);
          setIsLoading(false);
          return cached;
        }
      }

      // Fetch fresh data
      const freshData = await fetchFunction();
      await saveToCache(freshData);
      setIsLoading(false);
      return freshData;
    } catch (error) {
      // If fetch fails, try to use cached data even if expired
      const cached = await loadFromCache();
      if (cached !== null) {
        setCachedData(cached);
        setIsLoading(false);
        return cached;
      }

      // If no cached data available, use fallback
      setCachedData(fallbackData);
      setIsLoading(false);
      throw error;
    }
  }, [loadFromCache, saveToCache, fallbackData]);

  /**
   * Initialize cache on mount
   */
  useEffect(() => {
    loadFromCache().then((data) => {
      setCachedData(data);
      setIsLoading(false);
    });
  }, [loadFromCache]);

  /**
   * Check if cache is stale
   */
  const isStale = useCallback((): boolean => {
    if (!lastUpdated) return true;
    return Date.now() - lastUpdated.getTime() > ttl;
  }, [lastUpdated, ttl]);

  return {
    data: cachedData,
    isLoading,
    lastUpdated,
    isStale: isStale(),
    fetchData,
    saveToCache,
    clearCache,
    refresh: (fetchFunction: () => Promise<T>) => fetchData(fetchFunction, true),
  };
}

/**
 * Utility function to clear all app cache
 */
export async function clearAllCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith('convention_app_'));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
}

/**
 * Utility function to get cache size
 */
export async function getCacheSize(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith('convention_app_'));
    const items = await AsyncStorage.multiGet(appKeys);
    return items.reduce((total, [, value]) => total + (value?.length || 0), 0);
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
}
