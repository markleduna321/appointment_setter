import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, registerThunk } from './auth-thunk';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,        // string or object of field errors
        successMessage: null,
    },
    reducers: {
        clearError(state) {
            state.error = null;
        },
        clearAuth(state) {
            state.user = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── Login ────────────────────────────────────────────────────
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.successMessage = action.payload.message;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── Register ─────────────────────────────────────────────────
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.successMessage = action.payload.message;
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
