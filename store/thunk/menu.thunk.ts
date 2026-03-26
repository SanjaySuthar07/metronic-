import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getMenu = createAsyncThunk(
    "getMenu",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await api.get("/modules?type=menu");
            return response.data;
            } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                success: false,
                message: error.message || "Failed to fetch menu"
            });
        }
    }
);
