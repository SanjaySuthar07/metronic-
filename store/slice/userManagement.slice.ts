import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, fetchRoles } from "../thunk/userManagement.thunk";

interface UserState {
  users: any[];
  roles: any[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  perPage: number;
}

const initialState: UserState = {
  users: [],
  roles: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  perPage: 10,
};

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users.data;
        state.total = action.payload.users.total;
        state.currentPage = action.payload.users.current_page;
        state.perPage = action.payload.users.per_page;
      })
      .addCase(fetchUsers.rejected, (state, action: any) => {
        state.users = [];
        state.loading = false;
        state.error = action.payload;

      })
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.roles;
      })
      .addCase(fetchRoles.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userManagementSlice.reducer;