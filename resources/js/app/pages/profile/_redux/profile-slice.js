import { createSlice } from '@reduxjs/toolkit';
import { fetchProfileThunk, updateProfileThunk, updatePasswordThunk, deleteProfileThunk } from './profile-thunk';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        loading: false,
        submitting: false,
        error: null,
        formError: null,
        message: null,
    },
    reducers: {
        setProfile(state, action) {
            state.profile = action.payload;
        },
        clearMessage(state) {
            state.message = null;
            state.formError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileThunk.pending,   (s) => { s.loading = true; s.error = null; })
            .addCase(fetchProfileThunk.fulfilled, (s, a) => { s.loading = false; s.profile = a.payload; })
            .addCase(fetchProfileThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

            .addCase(updateProfileThunk.pending,   (s) => { s.submitting = true; s.formError = null; })
            .addCase(updateProfileThunk.fulfilled, (s, a) => { s.submitting = false; s.profile = a.payload; s.message = 'Profile updated'; })
            .addCase(updateProfileThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })

            .addCase(updatePasswordThunk.pending,   (s) => { s.submitting = true; s.formError = null; })
            .addCase(updatePasswordThunk.fulfilled, (s, a) => { s.submitting = false; s.message = 'Password updated'; })
            .addCase(updatePasswordThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })

            .addCase(deleteProfileThunk.pending,   (s) => { s.submitting = true; s.formError = null; })
            .addCase(deleteProfileThunk.fulfilled, (s, a) => { s.submitting = false; s.message = 'Account deleted'; })
            .addCase(deleteProfileThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; });
    },
});

export const { setProfile, clearMessage } = profileSlice.actions;
export default profileSlice.reducer;
