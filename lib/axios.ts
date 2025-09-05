import axios from "axios";
import { cookies } from "next/headers";


export const api = axios.create({
    baseURL: process.env.IRIS_BACKEND_PUBLIC_URL
});

// Write Interceptors If get Token Expried then call refresh token 

api.interceptors.request.use(
  async (config) => {
    const store = await cookies();
    const token = store.get("access_token")?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);