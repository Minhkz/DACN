import axios, { InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { getAccessTokenFromCookie } from '../auth/cookies';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error('NEXT_PUBLIC_API_URL chưa được khai báo trong .env.local');
}

export const serverApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

serverApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessTokenFromCookie();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
