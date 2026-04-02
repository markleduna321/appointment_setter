import { createAsyncThunk } from '@reduxjs/toolkit';
import { get_profile_service, update_profile_service, update_password_service, delete_profile_service } from '../../../services/profile-service';

export const fetchProfileThunk = createAsyncThunk(
    'profile/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await get_profile_service();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load profile.');
        }
    }
);

export const updateProfileThunk = createAsyncThunk(
    'profile/update',
    async (data, { rejectWithValue }) => {
        try {
            const user = await update_profile_service(data);
            // refresh app so header and auth user update
            try { window.location.reload(); } catch (e) { /* ignore */ }
            return user;
        } catch (err) {
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to update profile.');
        }
    }
);

export const updatePasswordThunk = createAsyncThunk(
    'profile/updatePassword',
    async (data, { rejectWithValue }) => {
        try {
            const res = await update_password_service(data);
            return res;
        } catch (err) {
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to update password.');
        }
    }
);

export const deleteProfileThunk = createAsyncThunk(
    'profile/delete',
    async (password, { rejectWithValue }) => {
        try {
            const res = await delete_profile_service(password);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to delete account.');
        }
    }
);
