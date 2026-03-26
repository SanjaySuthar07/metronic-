import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const moduleDetailsApi = createAsyncThunk(
    "moduleDetails",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await api.get(`/dynamic/create/${payload}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                success: false,
                message: error.message || "Failed to fetch module details"
            });
        }
    }
);


export const addDataApi = createAsyncThunk(
    "addData",
    async ({ slug, data }: any, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/dynamic/project`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                success: false,
                message: error.message || "Failed to add data"
            });
        }
    }
);
