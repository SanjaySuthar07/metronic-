import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
// general thunk
export const updateGeneralSettings = createAsyncThunk(
    "updateGeneralSettings",
    async (
        payload: Record<string, any>,
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post("/update-settings", payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to update settings";
            return rejectWithValue(message);
        }
    }
);
export const fetchGeneralSettings = createAsyncThunk(
    "getgeneralsettings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get-all-settings");
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch settings";
            return rejectWithValue(message);
        }
    }
);


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




// cache thunk
export const fetchCacheSettings = createAsyncThunk(
    "cache/fetch",
    async (payload: { type: string }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/${payload.type}`);

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to clear cache";
            return rejectWithValue(message);
        }
    }
);