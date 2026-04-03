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
            const response = await api.post(`/dynamic/${slug}`, data);
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


export const getDataApi = createAsyncThunk(
    "getData",
    async ({ slug }: any, { rejectWithValue }) => {
        try {
            const response = await api.get(`/dynamic/${slug}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                success: false,
                message: error.message || "Failed to get data"
            });
        }
    }
);


export const deleteDataApi = createAsyncThunk(
    "deleteData",
    async ({ slug, id }: any, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/dynamic/${slug}/${id}`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { message: "Delete failed" });
        }
    }
);

export const putFormApi = createAsyncThunk(
    "putForm",
    async ({ slug, id, data }: any, { rejectWithValue }) => {
        try {
            data.id = id;
            const response = await api.post(`/dynamic/update/${slug}`, data);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                success: false,
                message: error.message || "Failed to update data"
            });
        }
    }
);

export const getDetailApi = createAsyncThunk(
    "getDetail",
    async ({ slug, id }: any, { rejectWithValue }) => {
        try {
            const response = await api.get(`/dynamic/edit/${slug}/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                success: false,
                message: error.message || "Failed to get detail data"
            });
        }
    }
);