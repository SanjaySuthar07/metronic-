import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser } from '../thunk/auth.thunk';


interface AuthState {
    user: any;
    tenant: any;
    loading: boolean;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    tenant: null,
    loading: false,
    isAuthenticated: false,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.tenant = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.tenant = action.payload.tenant;
                localStorage.setItem('token', action.payload.token);
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action: any) => {
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.tenant = action.payload.tenant;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;