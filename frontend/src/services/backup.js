import api from './api';

export const downloadBackup = () =>
  api.get('/api/backup-database', { responseType: 'blob' });

export const restoreBackup = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/api/restore-database', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
