import { createSlice } from "@reduxjs/toolkit";
import { getColumnTypes, getAllModels, childUserTypeAdmin ,childUserTypeCustomer, fetchmodule } from "../thunk/masterModule.thunk";
const initialState = {
    // Add child Module  Dropdown  Data
    adminList: [],
    customerList: [],
    // Add child Module in side  add fild dropdown data 
    inputTypes: [],
    inputModel: [],
    setting: [],
    loading: false,
    mastmoduleloading: false,
    
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
            .addCase(getAllModels.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getAllModels.fulfilled, (state, action) => {
                console.log(action.payload.data)
                state.inputModel = action.payload.data
            })

            .addCase(getAllModels.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(childUserTypeAdmin.fulfilled, (state, action) => {
                console.log(action.payload.data)
                state.adminList = action.payload.admin
            })
             .addCase(childUserTypeCustomer.fulfilled, (state, action) => {
                console.log(action.payload.agency)
                state.customerList = action.payload.agency
            })
            .addCase(fetchmodule.pending, (state, action) => {
                state.mastmoduleloading = true
            })
            .addCase(fetchmodule.fulfilled, (state, action) => {
                console.log(action.payload.data)
                state.setting = action.payload.data
                state.mastmoduleloading = false
            })
            .addCase(fetchmodule.rejected, (state, action) => {
                state.mastmoduleloading = false
               
            })

    },
});

export default masterModuleSlice.reducer;


