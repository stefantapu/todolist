import axios from 'axios';

export const rootApi = axios.create({
  baseURL: 'https://todos-be.vercel.app',
});

rootApi.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});
