import { createSlice } from "@reduxjs/toolkit";
import { fetchInvitation } from "../thunk/invite.thunk";

interface inviteState {
    invite: {
        data: any[];
        total: number;
        currentPage: number;
        perPage: number;
    };
    loadingInvite: boolean;

}

const initialState: inviteState = {
    invite: {
        data: [],
        total: 0,
        currentPage: 1,
        perPage: 10,
    },
    loadingInvite: false
};

const inviteSlice = createSlice({
    name: "invite",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvitation.pending, (state) => {
                state.loadingInvite = true;
            })
            .addCase(fetchInvitation.fulfilled, (state, action) => {
                console.log(action.payload)
                // state.invite.data = action.payload.invite.data;
                // state.invite.total = action.payload.users.total;
                // state.invite.currentPage = action.payload.users.current_page;
                // state.invite.perPage = action.payload.users.per_page;
            })
            .addCase(fetchInvitation.rejected, (state) => {
                state.loadingInvite = true;
            })
    },
});

export default inviteSlice.reducer;


