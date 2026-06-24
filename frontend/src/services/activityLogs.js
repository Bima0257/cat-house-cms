import api from './api';

export const getActivityLogs = (params) =>
  api.get('/api/activity-logs', { params });

export const getActivityActions = () =>
  api.get('/api/activity-logs/actions');
