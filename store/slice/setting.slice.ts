import { createSlice } from "@reduxjs/toolkit";
import { fetchSettings, updateSettings } from "../thunk/setting.thunk";



const initialState = {
 setting:[],
 loading:false
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
       state.loading =true
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.setting = action.payload.settings
      })

      .addCase(fetchSettings.rejected, (state, action) => {
       state.loading =false
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        // prefer returned settings if provided, otherwise keep existing
        state.setting = action.payload?.settings ?? state.setting;
        state.loading = false;
      })
      .addCase(updateSettings.rejected, (state) => {
        state.loading = false;
      })
  },
});

export default settingsSlice.reducer;


