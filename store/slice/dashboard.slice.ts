import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, logoutUser, getProfile } from '../thunk/auth.thunk';
import { getDashboard } from '../thunk/dashboard.thunk';


interface DashboardState {
    count: any;
    loading: boolean;
}

const initialState: DashboardState = {
    count: null,
    loading: false,
};


const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboard.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.count = action.payload
            })
            .addCase(getDashboard.rejected, (state, action: any) => {
                state.loading = false;
            })
    },
});

export default dashboardSlice.reducer;