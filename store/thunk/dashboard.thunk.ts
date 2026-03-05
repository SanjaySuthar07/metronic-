import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDashboard = createAsyncThunk(
    'auth/getDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch dashboard";

            return rejectWithValue(message);
        }
    }
);