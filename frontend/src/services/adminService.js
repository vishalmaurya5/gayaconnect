import api from './api';

export const getDashboardStatsApi = async () => (await api.get('/admin/dashboard')).data;
export const getAllUsersApi = async () => (await api.get('/admin/users')).data;
export const toggleUserStatusApi = async (id) => (await api.patch(`/admin/users/${id}/toggle`)).data;
export const getRevenueAnalyticsApi = async () => (await api.get('/admin/revenue')).data;
export const getAllBookingsApi = async () => (await api.get('/admin/bookings')).data;
export const deleteBookingApi = async (id) => (await api.delete(`/admin/bookings/${id}`)).data;
export const getAllReviewsApi = async () => (await api.get('/admin/reviews')).data;
