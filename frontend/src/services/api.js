import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => Promise.reject(err)
);

export default api;
