import api from './api';

export const getVendorsApi = async (params) => (await api.get('/vendors', { params })).data;
export const getVendorBySlugApi = async (slug) => (await api.get(`/vendors/${slug}`)).data;
export const getNearbyVendorsApi = async (params) => (await api.get('/vendors/nearby', { params })).data;
export const createVendorApi = async (payload) => (await api.post('/vendors', payload)).data;
export const updateVendorApi = async (id, payload) => (await api.put(`/vendors/${id}`, payload)).data;
export const deleteVendorApi = async (id) => (await api.delete(`/vendors/${id}`)).data;
export const approveVendorApi = async (id) => (await api.patch(`/vendors/${id}/approve`)).data;
export const rejectVendorApi = async (id, reason) => (await api.patch(`/vendors/${id}/reject`, { reason })).data;
export const getMyVendorProfileApi = async () => (await api.get('/vendors/me')).data;
