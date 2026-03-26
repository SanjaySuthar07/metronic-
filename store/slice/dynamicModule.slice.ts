import { createSlice } from "@reduxjs/toolkit";
import { getDataApi, getDetailApi, moduleDetailsApi, putFormApi } from "../thunk/dynamicModule.thunk";
interface DynamicModuleState {
    moduleList: any[];
    getModuleTableData: any[];
    loading: boolean;
    moduleListLoading: boolean;
    getModuleTableDataLoading: boolean;
    getModuleDetailTableData: any[];
}
const initialState: DynamicModuleState = {
    moduleList: [],
    getModuleTableData: [],
    getModuleDetailTableData: [],
    loading: false,
    moduleListLoading: false,
    getModuleTableDataLoading: false
};

const dynamicModuleSlice = createSlice({
    name: "dynamicModule",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(moduleDetailsApi.pending, (state) => {
                state.moduleListLoading = true;
            })
            .addCase(moduleDetailsApi.fulfilled, (state, action) => {
                state.moduleListLoading = false;
                state.moduleList = action.payload;
            })
            .addCase(moduleDetailsApi.rejected, (state, action) => {
                state.moduleListLoading = false;
            })
            .addCase(getDataApi.pending, (state) => {
                state.getModuleTableDataLoading = true;
            })
            .addCase(getDataApi.fulfilled, (state, action) => {
                state.getModuleTableDataLoading = false;
                state.getModuleTableData = action.payload;
            })
            .addCase(getDataApi.rejected, (state, action) => {
                state.getModuleTableDataLoading = false;
            })
            .addCase(getDetailApi.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDetailApi.fulfilled, (state, action) => {
                state.loading = false;
                state.getModuleDetailTableData = action.payload;
            })
            .addCase(getDetailApi.rejected, (state, action) => {
                state.loading = false;
            })
    },
});

export default dynamicModuleSlice.reducer;


