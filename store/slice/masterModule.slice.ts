import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    setting: [],
    loading: false
};
const masterModuleSlice = createSlice({
    name: "masterModule",
    initialState,
    reducers: {},
});

export default masterModuleSlice.reducer;


