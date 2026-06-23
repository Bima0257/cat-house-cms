import api from './api';

export const getProduk = (params) => api.get('/api/produk', { params });
export const getProdukById = (id) => api.get(`/api/produk/${id}`);
export const createProduk = (data) => api.post('/api/produk', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateProduk = (id, data) => api.post(`/api/produk/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProduk = (id) => api.delete(`/api/produk/${id}`);
export const toggleProdukActive = (id) => api.patch(`/api/produk/${id}/toggle-active`);
