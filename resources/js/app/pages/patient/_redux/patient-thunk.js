import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	get_patients_service,
	create_patient_service,
	update_patient_service,
	delete_patient_service,
} from '../../../services/patient-service';

export const fetchPatientsThunk = createAsyncThunk(
	'patients/fetchAll',
	async (params = {}, { rejectWithValue }) => {
		try {
			return await get_patients_service(params);
		} catch (err) {
			return rejectWithValue(err.response?.data?.message ?? 'Failed to load patients.');
		}
	}
);

export const createPatientThunk = createAsyncThunk(
	'patients/create',
	async (data, { rejectWithValue, dispatch }) => {
		try {
			const patient = await create_patient_service(data);
			dispatch(fetchPatientsThunk());
			return patient;
		} catch (err) {
			const laravelErrors = err.response?.data?.errors;
			if (laravelErrors) {
				const first = Object.values(laravelErrors)[0];
				return rejectWithValue(Array.isArray(first) ? first[0] : first);
			}
			return rejectWithValue(err.response?.data?.message ?? 'Failed to create patient.');
		}
	}
);

export const updatePatientThunk = createAsyncThunk(
	'patients/update',
	async ({ id, data }, { rejectWithValue, dispatch }) => {
		try {
			const patient = await update_patient_service(id, data);
			dispatch(fetchPatientsThunk());
			return patient;
		} catch (err) {
			const laravelErrors = err.response?.data?.errors;
			if (laravelErrors) {
				const first = Object.values(laravelErrors)[0];
				return rejectWithValue(Array.isArray(first) ? first[0] : first);
			}
			return rejectWithValue(err.response?.data?.message ?? 'Failed to update patient.');
		}
	}
);

export const deletePatientThunk = createAsyncThunk(
	'patients/delete',
	async (id, { rejectWithValue, dispatch }) => {
		try {
			const res = await delete_patient_service(id);
			dispatch(fetchPatientsThunk());
			return res;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message ?? 'Failed to delete patient.');
		}
	}
);

