import api from './api';

export const loginApi = async (payload) => (await api.post('/auth/login', payload)).data;
export const registerApi = async (payload) => (await api.post('/auth/register', payload)).data;
export const logoutApi = async () => (await api.post('/auth/logout')).data;
export const forgotPasswordApi = async (email) => (await api.post('/auth/forgot-password', { email })).data;
export const resetPasswordApi = async (token, password) => (await api.put(`/auth/reset-password/${token}`, { password })).data;
export const verifyEmailApi = async (token) => (await api.get(`/auth/verify-email/${token}`)).data;
export const getMeApi = async () => (await api.get('/auth/me')).data;
export const updateProfileApi = async (payload) => (await api.put('/auth/profile', payload)).data;
