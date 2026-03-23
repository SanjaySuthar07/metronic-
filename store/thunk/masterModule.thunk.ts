import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const getColumnTypes = createAsyncThunk(
    "getColumnTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get-column-types");
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);