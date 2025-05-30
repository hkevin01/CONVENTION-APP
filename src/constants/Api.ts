/**
 * API endpoints and configuration
 */

// Base URL for the API
export const API_URL = process.env.API_URL || 'http://localhost:4000/api';

// API endpoint paths
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  EVENTS: '/events',
  ANNOUNCEMENTS: '/announcements',
  PROFILE: '/profile',
  TICKETS: {
    CHECKIN: '/tickets/checkin',
  },
};
