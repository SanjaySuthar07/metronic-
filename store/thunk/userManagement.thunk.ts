import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
interface FetchUsersPayload {
  user_type?: string;
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  dir?: "asc" | "desc";
}
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (payload: FetchUsersPayload | undefined, { rejectWithValue }) => {
    try {
      const response = await api.get("/users", {
        params: {
          user_type: payload?.user_type,
          page: payload?.page,
          limit: payload?.per_page,
          search: payload?.search,
          sort: payload?.sort,
          dir: payload?.dir,
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
interface FetchUserDetail {
  id?: any;
}
export const fetchUserDetail = createAsyncThunk(
  "users/fetchUserDetail",
  async (payload: FetchUserDetail, { rejectWithValue }) => {
    try {
      console.log("this is page ", payload)
      const response = await api.get("/user-details", {
        params: {
          id: payload?.id
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



export const fetchRoles = createAsyncThunk(
  "users/fetchRoles",
  async (payload: FetchUsersPayload, { rejectWithValue }) => {
    try {
      const response = await api.get("/roles", {
        params: {
          page: payload?.page,
          limit: payload?.per_page,
          search: payload?.search,
          sort: payload?.sort,
          dir: payload?.dir,
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

export const fetchRolesDropdown = createAsyncThunk(
  "users/fetchRoles",
  async (payload: FetchUsersPayload, { rejectWithValue }) => {
    try {
      const response = await api.get("/roles", {
        params: {
          select: true
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


