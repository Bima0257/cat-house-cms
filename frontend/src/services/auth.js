import api from './api';

export const loginApi = (data) => api.post('/api/login', data);
export const logoutApi = () => api.post('/api/logout');
export const getUser = () => api.get('/api/me');
export const registerApi = (data) => api.post('/api/register', data);
export const verifyCodeApi = (data) => api.post('/api/verify-code', data);
export const resendCodeApi = (email) => api.post('/api/resend-code', { email });
export const updateProfileApi = (data) => api.post('/api/me', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
