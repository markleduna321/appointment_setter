import { createSlice } from '@reduxjs/toolkit';
import {
    fetchStaffUsersThunk,
    createStaffUserThunk,
    deleteStaffUserThunk,
} from './user-management-thunk';

const userManagementSlice = createSlice({
    name: 'userManagement',
    initialState: {
        users: [],
        loading: false,
        submitting: false,
        error: null,
        formError: null,
        formSuccess: null,
    },
    reducers: {
        clearFormStatus(state) {
            state.formError = null;
            state.formSuccess = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchStaffUsersThunk.pending,   (s)    => { s.loading = true; s.error = null; })
            .addCase(fetchStaffUsersThunk.fulfilled, (s, a) => { s.loading = false; s.users = a.payload; })
            .addCase(fetchStaffUsersThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
            // create
            .addCase(createStaffUserThunk.pending,   (s)    => { s.submitting = true; s.formError = null; s.formSuccess = null; })
            .addCase(createStaffUserThunk.fulfilled, (s)    => { s.submitting = false; s.formSuccess = 'User created successfully.'; })
            .addCase(createStaffUserThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })
            // delete
            .addCase(deleteStaffUserThunk.pending,   (s)    => { s.loading = true; })
            .addCase(deleteStaffUserThunk.fulfilled, (s)    => { s.loading = false; })
            .addCase(deleteStaffUserThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
    },
});

export const { clearFormStatus } = userManagementSlice.actions;
export default userManagementSlice.reducer;
