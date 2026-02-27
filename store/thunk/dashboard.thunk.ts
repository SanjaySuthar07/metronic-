import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDashboard = createAsyncThunk(
    'auth/getDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch dashboard";

            return rejectWithValue(message);
        }
    }
);