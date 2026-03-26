import { createSlice } from "@reduxjs/toolkit";
import { moduleDetailsApi } from "../thunk/dynamicModule.thunk";
interface DynamicModuleState {
    moduleList: any[];
    loading: boolean;
    moduleListLoading: boolean;
}
const initialState: DynamicModuleState = {
    moduleList: [],
    loading: false,
    moduleListLoading: false
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
    },
});

export default dynamicModuleSlice.reducer;


