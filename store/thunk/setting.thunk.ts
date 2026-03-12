import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSettings = createAsyncThunk(
  "getallsettings",
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

export const updatePermissions = createAsyncThunk(
  "updatesettings",
  async (
    payload: { id: number; key: string; value: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('update-settings', {
        id: payload.id,
        key: payload.key,
        value: payload.value
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update settings";
      return rejectWithValue(message);
    }
  }
);

export const updateSettings = createAsyncThunk(
  "updateSettings",
  async (
    payload: { settings: { id: number; key: string; value: string }[] },
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