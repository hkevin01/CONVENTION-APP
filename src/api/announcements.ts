/**
 * API services for announcements
 */
import { API_ENDPOINTS } from '../constants/Api';
import api from './client';

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all announcements from the API
 */
export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const response = await api.get(API_ENDPOINTS.ANNOUNCEMENTS);
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
}

/**
 * Fetch a single announcement by ID
 */
export async function fetchAnnouncementById(id: string): Promise<Announcement> {
  try {
    const response = await api.get(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching announcement ${id}:`, error);
    throw error;
  }
}
