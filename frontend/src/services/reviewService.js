import api from './api';

export const createReviewApi = async (payload) => (await api.post('/reviews', payload)).data;
export const deleteReviewApi = async (id) => (await api.delete(`/reviews/${id}`)).data;
export const getMyReviewsApi = async () => (await api.get('/reviews/my')).data;
