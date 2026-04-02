import { createSlice } from '@reduxjs/toolkit';
import { fetchPatientsThunk, createPatientThunk, updatePatientThunk, deletePatientThunk } from './patient-thunk';

const patientSlice = createSlice({
	name: 'patients',
	initialState: {
		patients: [],
		filters: { search: '' },
		modalOpen: false,
		selectedPatient: null,
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
			state.selectedPatient = action.payload ?? null;
			state.formError = null;
		},
		closeModal(state) {
			state.modalOpen = false;
			state.selectedPatient = null;
			state.formError = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPatientsThunk.pending,   (s)    => { s.loading = true; s.error = null; })
			.addCase(fetchPatientsThunk.fulfilled, (s, a) => { s.loading = false; s.patients = a.payload; })
			.addCase(fetchPatientsThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

			.addCase(createPatientThunk.pending,   (s)    => { s.submitting = true; s.formError = null; })
			.addCase(createPatientThunk.fulfilled, (s)    => { s.submitting = false; s.modalOpen = false; s.selectedPatient = null; })
			.addCase(createPatientThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })

			.addCase(updatePatientThunk.pending,   (s)    => { s.submitting = true; s.formError = null; })
			.addCase(updatePatientThunk.fulfilled, (s)    => { s.submitting = false; s.modalOpen = false; s.selectedPatient = null; })
			.addCase(updatePatientThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })

			.addCase(deletePatientThunk.pending,   (s)    => { s.loading = true; })
			.addCase(deletePatientThunk.fulfilled, (s)    => { s.loading = false; })
			.addCase(deletePatientThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
	},
});

export const { setFilters, openModal, closeModal } = patientSlice.actions;
export default patientSlice.reducer;

