import { createSlice } from "@reduxjs/toolkit";
import { getMenu } from "../thunk/menu.thunk";

const initialState = {
    menu: [],
    loading: false
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMenu.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getMenu.fulfilled, (state, action) => {
            state.menu = action.payload;
            state.loading = false;
        });
        builder.addCase(getMenu.rejected, (state) => {
            state.loading = false;
        });
    },
});

export default menuSlice.reducer;


