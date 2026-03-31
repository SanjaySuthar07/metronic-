import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, verifyMfa, logoutUser, getProfile } from '../thunk/auth.thunk';
interface AuthState {
    user: any;
    loading: boolean;
    rememberUser: any;
}
const initialState: AuthState = {
    user: null,
    loading: false,
    rememberUser: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        remember: (state, action) => {
            state.rememberUser = action.payload
        },
        removeData: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action: any) => {
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                    localStorage.setItem('refresh_token', action.payload.refresh_token);
                }
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                state.user = null
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
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                state.user = null
            })
            .addCase(verifyMfa.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyMfa.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                    localStorage.setItem('refresh_token', action.payload.refresh_token);
                }
            })
            .addCase(verifyMfa.rejected, (state) => {
                state.loading = false;
            })
    },
});
export const { remember, removeData } = authSlice.actions
export default authSlice.reducer;