import axios from 'axios';

export const rootApi = axios.create({
  baseURL: 'https://todos-be.vercel.app',
});
