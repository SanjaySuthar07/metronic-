import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menu: [],
    loading: false
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

    },
});

export default menuSlice.reducer;


