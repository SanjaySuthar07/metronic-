import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/register', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error?.response?.data?.errors).flat().join(" ")
                    : error.response?.data?.message || "Registration failed";

            return rejectWithValue(message);
        }
    }
);

interface LoginPayload {
    email: string;
    password: string;
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/login', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Login failed";

            return rejectWithValue(message);
        }
    }
);
interface ForgetPasswordPayload {
    email: string;
}

export const forgetPassword = createAsyncThunk(
    'auth/forgot-password',
    async (payload: ForgetPasswordPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/forgot-password', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Something went wrong";

            return rejectWithValue(message);
        }
    }
);

interface ResetPasswordPayload {
    email: string;
    token: string;
    password: string;
}

export const resetPassword = createAsyncThunk(
    'auth/reset-password',
    async (payload: ResetPasswordPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/reset-password', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Something went wrong";

            return rejectWithValue(message);
        }
    }
);


export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post(
                '/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Logout failed';
            return rejectWithValue(message);
        }
    }
);