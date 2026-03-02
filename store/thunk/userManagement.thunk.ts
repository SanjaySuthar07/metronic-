import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
interface FetchUsersPayload {
  user_type?: string;
}
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (payload: FetchUsersPayload | undefined, { rejectWithValue }) => {
    try {
      const response = await api.get("/users", {
        params: {
          user_type: payload?.user_type,
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