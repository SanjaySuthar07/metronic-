import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// email thunk
export const fetchSmtpSettings = createAsyncThunk(
    "smtp/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/smtp-settings");

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch SMTP settings";
            return rejectWithValue(message);
        }
    }
);

export const updateSmtpSettings = createAsyncThunk(
    "smtp/update",
    async (payload: Record<string, any>, { rejectWithValue }) => {
        try {
            const response = await api.post("/update-smtp-settings", payload);

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to update SMTP settings";
            return rejectWithValue(message);
        }
    }
);
// recaptcha thunk
export const fetchReceptchSettings = createAsyncThunk(
    "recaptcha/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/recaptcha-settings");

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch receptch settings";
            return rejectWithValue(message);
        }
    }
);

export const updateReceptchSettings = createAsyncThunk(
    "recaptcha/update",
    async (payload: Record<string, any>, { rejectWithValue }) => {
        try {
            const response = await api.post("/update-recaptcha-settings", payload);

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to update receptch settings";
            return rejectWithValue(message);
        }
    }
);
