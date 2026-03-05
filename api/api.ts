import { store } from '@/store';
import { removeData } from '@/store/slice/auth.slice';
import axios from 'axios';
const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        try {
            const refresh_token = localStorage.getItem('refresh_token');
            if (!refresh_token) {
                localStorage.removeItem('token');
                window.location.href = '/signin';
                return Promise.reject(error);
            }
            const response = await axios.post(
                '/api/refresh',
                { refresh_token },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );
            const newAccessToken = response.data.token;
            localStorage.setItem('token', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (error) {
            store.dispatch(removeData());
            // window.location.href = '/signin';
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
}
);
export default api;

