import api from './api';

export const createOrderApi = async (payload) => (await api.post('/payments/order', payload)).data;
export const verifyPaymentApi = async (payload) => (await api.post('/payments/verify', payload)).data;
export const getPaymentHistoryApi = async () => (await api.get('/payments/history')).data;
