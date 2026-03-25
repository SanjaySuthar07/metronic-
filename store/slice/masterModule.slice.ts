import { createSlice } from "@reduxjs/toolkit";
import { getColumnTypes, getAllModels, fetchmodule, childUserTypeAdmin, childUserTypeCustomer, createModule, updateModule, moduleDetailsApi } from "../thunk/masterModule.thunk";
interface MasterModuleState {
    adminList: any[];
    customerList: any[];
    inputTypes: any[];
    inputModel: any[];
    setting: any[];
    moduleDetails: any[];
    createModuleResponse: any;
    mastmoduleloading: any,
    loading: boolean;
    moduleList: any[];
}

const initialState: MasterModuleState = {
    // Add child Module  Dropdown  Data
    adminList: [],
    customerList: [],
    // Add child Module in side  add fild dropdown data 
    inputTypes: [],
    inputModel: [],
    setting: [],
    // module list data
    moduleList: [],
    moduleDetails: [],
    createModuleResponse: null,
    loading: false,
    mastmoduleloading: false,
};
const masterModuleSlice = createSlice({
    name: "masterModule",
    initialState,
    reducers: {
        removeCreateModuleMessage: (state, action) => {
            state.createModuleResponse = null;
            state.loading = false
        }
    },
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
            .addCase(createModule.pending, (state) => {
                state.loading = true;
            })
            .addCase(createModule.fulfilled, (state, action) => {
                state.loading = false;
                state.createModuleResponse = action.payload;
            })
            .addCase(createModule.rejected, (state, action) => {
                state.loading = false;
                state.createModuleResponse = action.payload;
            })
            .addCase(moduleDetailsApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(moduleDetailsApi.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action.payload.data", action.payload.data)
                state.moduleDetails = action.payload.data;
            })
            .addCase(moduleDetailsApi.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(updateModule.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateModule.fulfilled, (state, action) => {
                state.loading = false;
                state.createModuleResponse = action.payload;
            })
            .addCase(updateModule.rejected, (state, action) => {
                state.loading = false;
                state.createModuleResponse = action.payload;
            })
            .addCase(fetchmodule.pending, (state, action) => {
                state.mastmoduleloading = true
            })
            .addCase(fetchmodule.fulfilled, (state, action) => {
                console.log(action.payload.data)
                state.moduleList = action.payload.data
                state.mastmoduleloading = false
            })
            .addCase(fetchmodule.rejected, (state, action) => {
                state.mastmoduleloading = false

            })
    },
});
export const { removeCreateModuleMessage } = masterModuleSlice.actions;

export default masterModuleSlice.reducer;


