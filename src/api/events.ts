/**
 * API services for events
 */
import api from './client';
import { API_ENDPOINTS } from '../constants/Api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

/**
 * Fetch all events from the API
 */
export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await api.get(API_ENDPOINTS.EVENTS);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

/**
 * Fetch a single event by ID
 */
export async function fetchEventById(id: string): Promise<Event> {
  try {
    const response = await api.get(`${API_ENDPOINTS.EVENTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
}
