import api from './api';

export const fetchActiveBanners = async () => (await api.get('/banners/active')).data;
export const trackBannerClick = async (id) => (await api.post(`/banners/${id}/click`)).data;
