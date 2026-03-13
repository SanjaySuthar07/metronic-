import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, fetchRoles, fetchPermissions, fetchUserDetail } from "../thunk/userManagement.thunk";

interface UserManagementState {
  users: {
    data: any[];
    total: number;
    currentPage: number;
    perPage: number;
  };
  roles: {
    data: any[];
    total: number;
    currentPage: number;
    perPage: number;
  };
  userDetail: any | null;
  loadingUsers: boolean;
  loadingRoles: boolean;
  loadingUserDetail: boolean;
  loadingPermissions: boolean
  error: string | null;
  permissions: {
    data: any[];
    total: number;
    currentPage: number;
    perPage: number;
  };
}

const initialState: UserManagementState = {
  users: {
    data: [],
    total: 0,
    currentPage: 1,
    perPage: 10,
  },
  roles: {
    data: [],
    total: 0,
    currentPage: 1,
    perPage: 10,
  },
  userDetail: null,
  loadingUsers: false,
  loadingRoles: false,
  loadingUserDetail: false,
  loadingPermissions: false,
  error: null,
  permissions: {
    data: [],
    total: 0,
    currentPage: 1,
    perPage: 10,
  },
};

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingUsers = true;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users.data = action.payload.users.data;
        state.users.total = action.payload.users.total;
        state.users.currentPage = action.payload.users.current_page;
        state.users.perPage = action.payload.users.per_page;
      })
      .addCase(fetchUserDetail.pending, (state) => {
        state.loadingUserDetail = true;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loadingUserDetail = false;
        if (action.payload.user.tenant_id != null) {
          state.userDetail = action.payload.user;
        }
        else if (action.payload.user.user_type == "admin") {
          state.userDetail = action.payload.user;
        }
      })

      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loadingUserDetail = false;
        state.error = action.payload as string;
      })

      .addCase(fetchRoles.pending, (state) => {
        state.loadingRoles = true;
      })

      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loadingRoles = false;
        state.roles.data = action?.payload?.roles?.data;
        state.roles.total = action?.payload?.roles?.total;
        state.roles.currentPage = action?.payload?.roles?.current_page;
        state.roles.perPage = action?.payload?.roles?.per_page;
      })

      .addCase(fetchPermissions.pending, (state) => {
        state.loadingPermissions = true;
      })

      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loadingPermissions = false;

        state.permissions.data = action.payload.permissions.data;
        state.permissions.total = action.payload.permissions.total;
        state.permissions.currentPage = action.payload.permissions.current_page;
        state.permissions.perPage = action.payload.permissions.per_page;
      })
  },
});

export default userManagementSlice.reducer;


