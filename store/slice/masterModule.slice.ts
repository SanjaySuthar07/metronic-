import { createSlice } from "@reduxjs/toolkit";
import { getColumnTypes } from "../thunk/masterModule.thunk";
const initialState = {
    inputTypes: [],
    setting: [],
    loading: false
};
const masterModuleSlice = createSlice({
    name: "masterModule",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getColumnTypes.pending, (state) => {
                state.loading = true
            })
            .addCase(getColumnTypes.fulfilled, (state, action) => {
                console.log(action.payload.data)
                state.inputTypes = action.payload.data
            })

            .addCase(getColumnTypes.rejected, (state, action) => {
                state.loading = false
            })
    },
});

export default masterModuleSlice.reducer;


