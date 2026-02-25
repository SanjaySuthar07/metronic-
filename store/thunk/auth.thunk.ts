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
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);