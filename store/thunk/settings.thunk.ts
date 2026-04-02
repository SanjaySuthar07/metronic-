import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSmtpSettings = createAsyncThunk(
    "smtp/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/smtp-settings", {
                headers: {
                    Accept: "application/json",
                },
            });

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
    async (
        payload: {
            MAIL_MAILER: string;
            MAIL_HOST: string;
            MAIL_PORT: number;
            MAIL_USERNAME: string;
            MAIL_PASSWORD: string;
            MAIL_ENCRYPTION: string;
            MAIL_FROM_ADDRESS: string;
            MAIL_FROM_NAME: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post(
                "/update-smtp-settings",
                payload,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to update SMTP settings";
            return rejectWithValue(message);
        }
    }
);