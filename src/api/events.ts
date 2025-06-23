/**
 * API services for events
 */
import { API_ENDPOINTS } from '../constants/Api';
import api from './client';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category?: string;
  duration?: number;
  capacity?: number;
  registeredCount?: number;
  tags?: string[];
  speaker?: {
    name: string;
    bio: string;
    photo: string;
  };
  isActive?: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'title' | 'location' | 'category';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: EventFilters;
}

/**
 * Fetch events with optional filtering and pagination
 */
export async function fetchEvents(filters?: EventFilters): Promise<Event[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.EVENTS}?${queryString}` : API_ENDPOINTS.EVENTS;
    
    const response = await api.get(url);
    
    // Handle both old format (array) and new format (object with events array)
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return response.data.events || [];
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

/**
 * Fetch events with full response including pagination
 */
export async function fetchEventsWithPagination(filters?: EventFilters): Promise<EventsResponse> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.EVENTS}?${queryString}` : API_ENDPOINTS.EVENTS;
    
    const response = await api.get(url);
    
    // Handle both old format (array) and new format (object)
    if (Array.isArray(response.data)) {
      return {
        events: response.data,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalEvents: response.data.length,
          hasNext: false,
          hasPrev: false,
        },
        filters: filters || {}
      };
    } else {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching events with pagination:', error);
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

/**
 * Fetch event categories for filter options
 */
export async function fetchEventCategories(): Promise<string[]> {
  try {
    const response = await api.get(`${API_ENDPOINTS.EVENTS}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event categories:', error);
    throw error;
  }
}

/**
 * Fetch event locations for filter options
 */
export async function fetchEventLocations(): Promise<string[]> {
  try {
    const response = await api.get(`${API_ENDPOINTS.EVENTS}/locations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event locations:', error);
    throw error;
  }
}
