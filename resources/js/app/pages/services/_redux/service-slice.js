import { createSlice } from '@reduxjs/toolkit';
import { fetchServicesThunk, createServiceThunk, updateServiceThunk, deleteServiceThunk } from './service-thunk';

const serviceSlice = createSlice({
    name: 'services',
    initialState: {
        services: [],
        filters: { search: '', category: '', status: 'all' },
        modalOpen: false,
        selectedService: null,
        loading: false,
        submitting: false,
        error: null,
        formError: null,
    },
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        openModal(state, action) {
            state.modalOpen = true;
            state.selectedService = action.payload ?? null;
            state.formError = null;
        },
        closeModal(state) {
            state.modalOpen = false;
            state.selectedService = null;
            state.formError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServicesThunk.pending,   (s)    => { s.loading = true; s.error = null; })
            .addCase(fetchServicesThunk.fulfilled, (s, a) => { s.loading = false; s.services = a.payload; })
            .addCase(fetchServicesThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

            .addCase(createServiceThunk.pending,   (s)    => { s.submitting = true; s.formError = null; })
            .addCase(createServiceThunk.fulfilled, (s)    => { s.submitting = false; s.modalOpen = false; s.selectedService = null; })
            .addCase(createServiceThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })

            .addCase(updateServiceThunk.pending,   (s)    => { s.submitting = true; s.formError = null; })
            .addCase(updateServiceThunk.fulfilled, (s)    => { s.submitting = false; s.modalOpen = false; s.selectedService = null; })
            .addCase(updateServiceThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })

            .addCase(deleteServiceThunk.pending,   (s)    => { s.loading = true; })
            .addCase(deleteServiceThunk.fulfilled, (s)    => { s.loading = false; })
            .addCase(deleteServiceThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
    },
});

export const { setFilters, openModal, closeModal } = serviceSlice.actions;
export default serviceSlice.reducer;
