import { createSlice } from '@reduxjs/toolkit';
import { fetchDoctorsThunk, createDoctorThunk, updateDoctorThunk, deleteDoctorThunk } from './doctor-thunk';

const doctorSlice = createSlice({
    name: 'doctors',
    initialState: {
        doctors: [],
        filters: { search: '', specialty: '', status: 'all' },
        modalOpen: false,
        selectedDoctor: null,  // null = create mode, object = edit mode
        loading: false,
        submitting: false,
        error: null,
        formError: null,
        formSuccess: null,
    },
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        openModal(state, action) {
            state.modalOpen = true;
            state.selectedDoctor = action.payload ?? null;
            state.formError = null;
            state.formSuccess = null;
        },
        closeModal(state) {
            state.modalOpen = false;
            state.selectedDoctor = null;
            state.formError = null;
            state.formSuccess = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchDoctorsThunk.pending,   (s)    => { s.loading = true; s.error = null; })
            .addCase(fetchDoctorsThunk.fulfilled, (s, a) => { s.loading = false; s.doctors = a.payload; })
            .addCase(fetchDoctorsThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
            // create
            .addCase(createDoctorThunk.pending,   (s)    => { s.submitting = true; s.formError = null; })
            .addCase(createDoctorThunk.fulfilled, (s)    => { s.submitting = false; s.modalOpen = false; s.selectedDoctor = null; })
            .addCase(createDoctorThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })
            // update
            .addCase(updateDoctorThunk.pending,   (s)    => { s.submitting = true; s.formError = null; })
            .addCase(updateDoctorThunk.fulfilled, (s)    => { s.submitting = false; s.modalOpen = false; s.selectedDoctor = null; })
            .addCase(updateDoctorThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })
            // delete
            .addCase(deleteDoctorThunk.pending,   (s)    => { s.loading = true; })
            .addCase(deleteDoctorThunk.fulfilled, (s)    => { s.loading = false; })
            .addCase(deleteDoctorThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
    },
});

export const { setFilters, openModal, closeModal } = doctorSlice.actions;
export default doctorSlice.reducer;
