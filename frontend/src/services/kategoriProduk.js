import api from './api';

export const getKategoriProduk = (params) => api.get('/api/kategori-produk', { params });
export const getKategoriProdukById = (id) => api.get(`/api/kategori-produk/${id}`);
export const createKategoriProduk = (data) => api.post('/api/kategori-produk', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateKategoriProduk = (id, data) => api.post(`/api/kategori-produk/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteKategoriProduk = (id) => api.delete(`/api/kategori-produk/${id}`);
export const toggleKategoriProdukActive = (id) => api.patch(`/api/kategori-produk/${id}/toggle-active`);
export const reorderKategoriProduk = (items) => api.post('/api/kategori-produk/reorder', { items });
