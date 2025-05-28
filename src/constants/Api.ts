import Constants from 'expo-constants';

export const API_URL =
  Constants.expoConfig?.extra?.API_URL ||
  process.env.API_URL ||
  'http://localhost:4000/api';
