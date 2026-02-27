import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser, logoutUser, getProfile } from '../thunk/auth.thunk';


interface AuthState {
    user: any;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action: any) => {
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem('token');
            })
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action?.payload?.user;
            })
            .addCase(getProfile.rejected, (state) => {
                state.loading = false;
                state.user = null;
            })
    },
});

export default authSlice.reducer;