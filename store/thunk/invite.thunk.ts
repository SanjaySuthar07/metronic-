import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const fetchInvitation = createAsyncThunk(
    "users/fetchRoles",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await api.get("/invitation-list", {
                params: {
                    user_type: payload?.user_type,
                    status: payload?.status,
                    page: payload?.page,
                    limit: payload?.per_page,
                    search: payload?.search,
                    sort: payload?.sort,
                    dir: payload?.dir
                },
            });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);

export const fetchAgency = createAsyncThunk(
    "fetchAgency",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get-agency");
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);