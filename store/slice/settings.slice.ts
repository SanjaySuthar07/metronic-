import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSmtpSettings,
  updateSmtpSettings,
} from "../thunk/settings.thunk";

interface SettingsState {
  setting: any[];
  emailSetting: any;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SettingsState = {
  setting: [],
  emailSetting: null,
  loading: false,
  error: null,
  success: false,
};

const settingsSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSmtpSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchSmtpSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.emailSetting = action.payload;
    });

    builder.addCase(fetchSmtpSettings.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateSmtpSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(updateSmtpSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.emailSetting = action.payload;
    });

    builder.addCase(updateSmtpSettings.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
  },
});

export const { resetStatus } = settingsSlice.actions;
export default settingsSlice.reducer;