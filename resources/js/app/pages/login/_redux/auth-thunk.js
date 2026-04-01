import { createAsyncThunk } from '@reduxjs/toolkit';
import { router } from '@inertiajs/react';
import { login_service, register_service } from '../../../services/auth-service';

/**
 * Login thunk — calls the auth service and navigates to /dashboard on success.
 */
export const loginThunk = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await login_service(credentials);
            // After session is created, use Inertia router for SPA navigation
            router.visit('/dashboard');
            return data;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Login failed. Please check your credentials.';
            return rejectWithValue(message);
        }
    }
);

/**
 * Register thunk — calls the auth service and navigates to /dashboard on success.
 */
export const registerThunk = createAsyncThunk(
    'auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const data = await register_service(formData);
            router.visit('/dashboard');
            return data;
        } catch (err) {
            // Validation errors come back as err.response.data.errors (object)
            const errors = err.response?.data?.errors;
            if (errors) {
                // Return first validation message for each field as a flat string
                const first = Object.values(errors).flat()[0];
                return rejectWithValue(first);
            }
            const message =
                err.response?.data?.message ||
                'Registration failed. Please try again.';
            return rejectWithValue(message);
        }
    }
);
