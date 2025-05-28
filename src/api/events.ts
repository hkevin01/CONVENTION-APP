import api from './client';

export async function fetchEvents() {
  const response = await api.get('/events');
  return response.data;
}
