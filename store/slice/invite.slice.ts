import { createSlice } from "@reduxjs/toolkit";
import { fetchInvitation, fetchInvitationDetail } from "../thunk/invite.thunk";

interface inviteState {
  invite: {
    data: any[];
    total: number;
    currentPage: number;
    perPage: number;
  };
  inviteDetail: any,
  loadingInvite: boolean;
}

const initialState: inviteState = {
  invite: {
    data: [],
    total: 0,
    currentPage: 1,
    perPage: 10,
  },
  inviteDetail: {},
  loadingInvite: false,
};

const inviteSlice = createSlice({
  name: "invite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(fetchInvitation.pending, (state) => {
      state.loadingInvite = true;
    });

    builder.addCase(fetchInvitation.fulfilled, (state, action) => {

      state.loadingInvite = false;

      state.invite.data = action?.payload?.data?.data || [];
      state.invite.total = action?.payload?.data?.total || 0;
      state.invite.currentPage = action?.payload?.data?.current_page || 1;
      state.invite.perPage = action?.payload?.data?.per_page || 10;

    });

    builder.addCase(fetchInvitation.rejected, (state) => {
      state.loadingInvite = false;
    })


    builder.addCase(fetchInvitationDetail.pending, (state) => {
      state.loadingInvite = true;
    });

    builder.addCase(fetchInvitationDetail.fulfilled, (state, action) => {
      state.loadingInvite = false;
      console.log("inviteDetail", action?.payload)
      // state.invite.data = action?.payload?.data?.data || [];
      // state.invite.total = action?.payload?.data?.total || 0;
      // state.invite.currentPage = action?.payload?.data?.current_page || 1;
      // state.invite.perPage = action?.payload?.data?.per_page || 10;
    });

    builder.addCase(fetchInvitationDetail.rejected, (state) => {
      state.loadingInvite = false;
    });

  },
});

export default inviteSlice.reducer;