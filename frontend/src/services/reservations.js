import api from './api';

export const getReservations = (params) => api.get('/api/reservations', { params });
export const getReservation = (id) => api.get(`/api/reservations/${id}`);
export const createReservation = (data) => api.post('/api/reservations', data);
export const updateReservationStatus = (id, status) => api.patch(`/api/reservations/${id}/status`, { status });
export const deleteReservation = (id) => api.delete(`/api/reservations/${id}`);
