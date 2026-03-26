import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dynamicModule: [],
    loading: false
};

const dynamicModuleSlice = createSlice({
    name: "dynamicModule",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

    },
});

export default dynamicModuleSlice.reducer;


