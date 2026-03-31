import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
interface FetchUsersPayload {
  user_type?: string;
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  dir?: "asc" | "desc";
  id: any
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
          tenant_id: payload?.id
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
  tenant_id?: any
}


export const fetchUserDetail = createAsyncThunk(
  "users/fetchUserDetail",
  async (payload: FetchUserDetail, { rejectWithValue }) => {
    try {
      const response = await api.get("/user-details", {
        params: {
          id: payload?.id,
          tenant_id: payload?.tenant_id
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
  async (payload: { id: any, tenant_id: any }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/user/${payload.id}`, {
        params: {
          tenant_id: payload?.tenant_id
        }
      });
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
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.get("/roles", {
        params: {
          user_type: payload?.user_type,
          page: payload?.page,
          limit: payload?.per_page,
          search: payload?.search,
          sort: payload?.sort,
          dir: payload?.dir,
          tenant_id: payload?.tenant_id,
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

export const fetchRoleDetail = createAsyncThunk(
  "users/fetchRoleDetail",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.get(`/roles/${payload.id}`, {
        params: {
          tenant_id: payload?.tenant_id
        }
      });

      return response.data;

    } catch (error: any) {

      const message =
        error.response?.data?.message || "Failed to fetch role";

      return rejectWithValue(message);
    }
  }
);

export const fetchRolesDropdown = createAsyncThunk(
  "users/fetchRolesDropdown",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.get("/roles", {
        params: {
          select: true,
          tenant_id: payload
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
        permissions: payload.permissions,
        tenant_id: payload.tenant_id
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
  async (payload: { name: string; permissions: number[], tenant_id: any }, { rejectWithValue }) => {
    try {
      const response = await api.post("/roles", {
        name: payload.name,
        permissions: payload.permissions,
        tenant_id: payload.tenant_id
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create role";
      return rejectWithValue(message);
    }
  }
);


export const fetchPermissionsDropdown = createAsyncThunk(
  "users/fetchPermissionsDropdown",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.get("/permissions", {
        params: {
          select: true,
          ...(payload?.tenant_id && { tenant_id: payload.tenant_id })
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

export const fetchPermissions = createAsyncThunk(
  "permissions/fetchPermissions",
  async (payload: FetchUsersPayload | undefined, { rejectWithValue }) => {
    try {
      const response = await api.get("/permissions", {
        params: {
          page: payload?.page,
          limit: payload?.per_page,
          search: payload?.search,
          sort: payload?.sort,
          dir: payload?.dir,
          tenant_id: payload?.id
        },
      });

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch permissions";
      return rejectWithValue(message);
    }
  }
);
export const updatePermissions = createAsyncThunk(
  "permissions/updatePermissions",
  async (
    payload: { id: number; name: string; tenant_id: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/permissions/${payload.id}`, {
        name: payload.name,
        tenant_id: payload?.tenant_id
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update permissions";
      return rejectWithValue(message);
    }
  }
);
interface FetchPermissionsDetail {
  id?: any;
  tenant_id?: nay
}
export const fetchPermissionsDetail = createAsyncThunk(
  "permissions/fetchPermissionsDetail",
  async (payload: FetchPermissionsDetail, { rejectWithValue }) => {
    try {
      const response = await api.get(`/permissions/${payload?.id}`, {
        params: {
          tenant_id: payload?.tenant_id
        },
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch permissions";
      return rejectWithValue(message);
    }
  }
);

export const createPermissions = createAsyncThunk(
  "permissions/createPermissions",
  async (payload: { name: string; tenant_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post("/permissions", {
        name: payload.name,
        tenant_id: payload?.tenant_id
      });

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create permission";
      return rejectWithValue(message);
    }
  }
);

export const deletePermissions = createAsyncThunk(
  "permission/deletePermission",
  async (payload: { id: any, tenant_id: any }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/permissions/${payload.id}`, {
        params: {
          tenant_id: payload.tenant_id
        }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete user";
      return rejectWithValue(message);
    }
  }
);