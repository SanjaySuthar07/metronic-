import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    recaptcha_token: string;
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/register', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error?.response?.data?.errors).flat().join(" ")
                    : error.response?.data?.message || "Registration failed";

            return rejectWithValue(message);
        }
    }
);

interface LoginPayload {
    email: string;
    password: string;
    recaptcha_token: string;
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/login', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Network Problem";

            return rejectWithValue(message);
        }
    }
);

interface VerifyMfaPayload {
    user_id: number;
    otp: number;
    user_type: string;
}

export const verifyMfa = createAsyncThunk(
    'auth/verify-mfa',
    async (payload: VerifyMfaPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/verify-Mfa', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Invalid OTP";
            return rejectWithValue(message);
        }
    }
);

interface ResendOtpPayload {
    user_id: number;
    user_type: string;
}

export const resendOtp = createAsyncThunk(
    'auth/resend-otp',
    async (payload: ResendOtpPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/resend-otp', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to resend OTP";
            return rejectWithValue(message);
        }
    }
);

interface ForgetPasswordPayload {
    email: string;
    recaptcha_token: string;
}

export const forgetPassword = createAsyncThunk(
    'auth/forgot-password',
    async (payload: ForgetPasswordPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/forgot-password', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Something went wrong";

            return rejectWithValue(message);
        }
    }
);

interface ResetPasswordPayload {
    email: string;
    token: string;
    password: string;
    recaptcha_token: string;
}

export const resetPassword = createAsyncThunk(
    'auth/reset-password',
    async (payload: ResetPasswordPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/reset-password', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Something went wrong";

            return rejectWithValue(message);
        }
    }
);


export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/logout');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Logout failed';
            return rejectWithValue(message);
        }
    }
);

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user');
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to fetch profile";
            return rejectWithValue(message);
        }
    }
);

interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export const changePassword = createAsyncThunk(
    'auth/change-password',
    async (payload: ChangePasswordPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/change-password', payload);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(" ")
                    : error.response?.data?.message || "Something went wrong";

            return rejectWithValue(message);
        }
    }
);

interface UpdateProfilePayload {
    name: string;
}
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (payload: UpdateProfilePayload, { rejectWithValue }) => {
        try {
            const response = await api.post('/update-profile', payload);

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(' ')
                    : error.response?.data?.message || 'Network Problem';

            return rejectWithValue(message);
        }
    }
);