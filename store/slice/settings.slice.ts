import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGeneralSettings,
  fetchReceptchSettings,
  fetchSmtpSettings,
  updateGeneralSettings,
  updateReceptchSettings,
  updateSmtpSettings,
} from "../thunk/settings.thunk";

interface SettingsState {
  generalSetting: any;
  emailSetting: any;
  loading: boolean;
  error: string | null;
  recaptchaSetting: any;
  success: boolean;
}

const initialState: SettingsState = {
  generalSetting: [],
  emailSetting: {},
  recaptchaSetting: {},
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
    // ------------------------------
    // general setting reducer
    // ------------------------------
    builder.addCase(fetchGeneralSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchGeneralSettings.fulfilled, (state, action) => {
      console.log(action.payload)
      state.generalSetting = action.payload.data; // ✅ yaha change
    });

    builder.addCase(fetchGeneralSettings.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateGeneralSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(updateGeneralSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.generalSetting = action.payload;
    });

    builder.addCase(updateGeneralSettings.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
    // ------------------------------
    // email setting reducer
    // ------------------------------
    builder.addCase(fetchSmtpSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchSmtpSettings.fulfilled, (state, action) => {
      console.log(action.payload)
      state.emailSetting = action.payload.data; // ✅ yaha change
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
    // ------------------------------
    // recaptcha setting reducer
    // ------------------------------
    builder.addCase(fetchReceptchSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchReceptchSettings.fulfilled, (state, action) => {
      console.log(action.payload)
      state.recaptchaSetting = action.payload.data; // ✅ yaha change
    });

    builder.addCase(fetchReceptchSettings.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateReceptchSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(updateReceptchSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.recaptchaSetting = action.payload;
    });

    builder.addCase(updateReceptchSettings.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
  },
});

export const { resetStatus } = settingsSlice.actions;
export default settingsSlice.reducer;