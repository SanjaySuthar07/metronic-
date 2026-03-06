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

// ----------------------------
// user api 
// ----------------------------
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

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/update-user", payload);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update user";
      return rejectWithValue(message);
    }
  }
);


export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (payload: { id: any }, { rejectWithValue }) => {
    try {
      // DELETE request using RESTful endpoint with user ID in path
      const response = await api.delete(`/user/${payload.id}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete user";
      return rejectWithValue(message);
    }
  }
);

// ----------------------------
// Roles api 
// ----------------------------
export const fetchRoles = createAsyncThunk(
  "users/fetchRoles",
  async (payload: FetchUsersPayload, { rejectWithValue }) => {
    try {
      const response = await api.get("/roles", {
        params: {
          id: payload?.id,
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

interface FetchRoleDetail {
  id?: any;
}
export const fetchRoleDetail = createAsyncThunk(
  "users/fetchRoleDetail",
  async (payload: FetchRoleDetail, { rejectWithValue }) => {
    try {

      const response = await api.get(`/roles/${payload.id}`);

      return response.data;

    } catch (error: any) {

      const message =
        error.response?.data?.message || "Failed to fetch role";

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


export const updateRoles = createAsyncThunk(
  "roles/updateRoles",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/roles/${payload.id}`, {
        name: payload.name,
        permissions: payload.permissions
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update role permissions";
      return rejectWithValue(message);
    }
  }
);

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (payload: { name: string; permissions: number[] }, { rejectWithValue }) => {
    try {
      const response = await api.post("/roles", {
        name: payload.name,
        permissions: payload.permissions,
      });

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create role";
      return rejectWithValue(message);
    }
  }
);


// ----------------------------
// Parmission api 
// ----------------------------

export const fetchPermissionsDropdown = createAsyncThunk(
  "users/fetchPermissionsDropdown",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/permissions", {
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



