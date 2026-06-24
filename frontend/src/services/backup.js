import api from './api';

export const downloadBackup = () =>
  api.get('/api/backup-database', { responseType: 'blob' });
