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

interface InviteUserPayload {
    name: string
    email: string
    password: string
    user_type: string
    tenant_id?: string
}

export const createInviteUser = createAsyncThunk(
    "invite/createUser",
    async (payload: InviteUserPayload, { rejectWithValue }) => {
        try {
            const response = await api.post("/invite", payload)
            return response.data
        } catch (error: any) {

            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Network Problem"

            return rejectWithValue(message)
        }

    }
)


interface InviteUserPayload {
    data: string
    password: string
    password_confirmation: string
}

export const acceptInvitation = createAsyncThunk(
    "invite/acceptInvitation",
    async (payload: InviteUserPayload, { rejectWithValue }) => {
        try {
            const response = await api.post("/accept-invitation", payload)
            return response.data
        } catch (error: any) {

            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Network Problem"

            return rejectWithValue(message)
        }

    }
)

export const fetchInvitationDetail = createAsyncThunk(
    "fetchInvitationDetail",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await api.get(`/invitation-list/?id=${payload?.id}`);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);