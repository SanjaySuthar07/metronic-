import { store } from '@/store';
import { removeData } from '@/store/slice/auth.slice';
import axios, { AxiosRequestConfig } from 'axios';

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

// --- Token refresh queue to prevent multiple concurrent refresh calls ---
let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        const authEndpoints = ['/login', '/verify-Mfa', '/register', '/forgot-password', '/reset-password'];
        const isAuthRequest = authEndpoints.some(
            (url) => originalRequest?.url?.includes(url)
        );

        if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRequest) {
            // If a refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers = {
                                ...originalRequest.headers,
                                Authorization: `Bearer ${token}`,
                            };
                            resolve(api(originalRequest));
                        },
                        reject: (err: any) => {
                            reject(err);
                        },
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refresh_token = localStorage.getItem('refresh_token');

                if (!refresh_token) {
                    // No refresh token available — force logout
                    store.dispatch(removeData());
                    processQueue(error, null);
                    if (window.location.pathname !== '/signin') {
                        // window.location.href = '/signin';
                    }
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

                // If backend returns a new refresh token, update it too
                if (response.data.refresh_token) {
                    localStorage.setItem('refresh_token', response.data.refresh_token);
                }

                // Process queued requests with the new token
                processQueue(null, newAccessToken);

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed — clean up and redirect to signin
                processQueue(refreshError, null);
                store.dispatch(removeData());
                if (window.location.pathname !== '/signin') {
                    // window.location.href = '/signin';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;

