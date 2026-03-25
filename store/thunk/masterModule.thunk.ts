import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { de } from "zod/v4/locales";




// --------------------------------------------------------------
// child menu inside  Add Field form apis 
// --------------------------------------------------------------
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
// add fild type relation then this is call
export const getAllModels = createAsyncThunk(
    "getAllModels",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get-all-models");
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);

export const getByModelsNameData = createAsyncThunk(
    "getAllModels",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get-all-model-fields", {

            });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);
// curl --location 'http://192.168.1.14:8000/api/get-all-model-fields/Agency' \
// --header 'Authorization: Bearer Bearer 37|BURw49jCdnW8oE6denpLF9TYnLZ4wQvo00AzKJy9129f28c6'

// --------------------------------------------------------------
// child menu apis 
// --------------------------------------------------------------
export const childUserTypeAdmin = createAsyncThunk(
    "childUserTypeAdmin",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get-admin", {

            });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);
export const childUserTypeCustomer = createAsyncThunk(
    "childUserTypeCustomer",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get-agency", {

            });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);


export const fetchmodule = createAsyncThunk(
    "fetchmodule",
 async (
    params: { page: number; limit: number ; dir : string ; sort?: string },
    { rejectWithValue }
  ) => {
        try {
            
               const page = params?.page || 1;
      const limit = params?.limit || 10;
      const dir = params?.dir || "desc";
      const sort = params?.sort || "created_at";

      console.log("fetchmodule params", params);
            const response = await api.get(`/modules?page=${page}&limit=${limit}&sort=${sort}&dir=${dir}`);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);
// curl --location 'http://192.168.1.14:8000/api/get-admin' \
// --header 'Authorization: Bearer Bearer 37|BURw49jCdnW8oE6denpLF9TYnLZ4wQvo00AzKJy9129f28c6'
