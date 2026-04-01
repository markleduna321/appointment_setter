import { createSlice } from '@reduxjs/toolkit';
import { fetchAppointmentsThunk, createAppointmentThunk, updateAppointmentThunk, cancelAppointmentThunk } from './appointment-thunk';

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState: {
        appointments: [],
        filters: { search: '', status: 'all', date: '' },
        pagination: { page: 1, perPage: 10, total: 0 },
        modalOpen: false,
        selectedAppointment: null,
        loading: false,
        submitting: false,
        error: null,
    },
    reducers: {
        setFilters(state, action) { state.filters = { ...state.filters, ...action.payload }; state.pagination.page = 1; },
        setPage(state, action) { state.pagination.page = action.payload; },
        openModal(state, action) { state.modalOpen = true; state.selectedAppointment = action.payload ?? null; },
        closeModal(state) { state.modalOpen = false; state.selectedAppointment = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointmentsThunk.pending,  (s)    => { s.loading = true; s.error = null; })
            .addCase(fetchAppointmentsThunk.fulfilled,(s, a) => { s.loading = false; s.appointments = a.payload.data ?? a.payload; s.pagination.total = a.payload.total ?? (a.payload.data?.length ?? 0); s.pagination.perPage = a.payload.per_page ?? s.pagination.perPage; })
            .addCase(fetchAppointmentsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
            .addCase(createAppointmentThunk.pending,  (s)    => { s.submitting = true; })
            .addCase(createAppointmentThunk.fulfilled,(s)    => { s.submitting = false; s.modalOpen = false; s.selectedAppointment = null; })
            .addCase(createAppointmentThunk.rejected, (s, a) => { s.submitting = false; s.error = a.payload; })
            .addCase(updateAppointmentThunk.pending,  (s)    => { s.submitting = true; })
            .addCase(updateAppointmentThunk.fulfilled,(s)    => { s.submitting = false; s.modalOpen = false; s.selectedAppointment = null; })
            .addCase(updateAppointmentThunk.rejected, (s, a) => { s.submitting = false; s.error = a.payload; })
            .addCase(cancelAppointmentThunk.pending,  (s)    => { s.submitting = true; })
            .addCase(cancelAppointmentThunk.fulfilled,(s)    => { s.submitting = false; })
            .addCase(cancelAppointmentThunk.rejected, (s, a) => { s.submitting = false; s.error = a.payload; });
    },
});

export const { setFilters, setPage, openModal, closeModal } = appointmentSlice.actions;
export default appointmentSlice.reducer;
