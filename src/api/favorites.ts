/**
 * API services for user favorites
 */
import api from './client';
import { Event } from './events';

export interface FavoriteEvent extends Event {
  favoriteId: string;
  addedAt: string;
}

/**
 * Fetch user's favorite events
 */
export async function fetchUserFavorites(): Promise<FavoriteEvent[]> {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    throw error;
  }
}

/**
 * Add event to user's favorites
 */
export async function addToFavorites(eventId: string): Promise<{ message: string; favoriteId: string }> {
  try {
    const response = await api.post(`/favorites/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
}

/**
 * Remove event from user's favorites
 */
export async function removeFromFavorites(eventId: string): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/favorites/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
}

/**
 * Check if event is favorited by user
 */
export async function checkFavoriteStatus(eventId: string): Promise<{ isFavorited: boolean; favoriteId: string | null }> {
  try {
    const response = await api.get(`/favorites/check/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
}
