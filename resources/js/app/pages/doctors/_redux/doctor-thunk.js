import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    get_doctors_service,
    create_doctor_service,
    update_doctor_service,
    delete_doctor_service,
} from '../../../services/doctor-service';

export const fetchDoctorsThunk = createAsyncThunk(
    'doctors/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            return await get_doctors_service(params);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load doctors.');
        }
    }
);

export const createDoctorThunk = createAsyncThunk(
    'doctors/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const doctor = await create_doctor_service(data);
            dispatch(fetchDoctorsThunk());
            return doctor;
        } catch (err) {
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to create doctor.');
        }
    }
);

export const updateDoctorThunk = createAsyncThunk(
    'doctors/update',
    async ({ id, data }, { rejectWithValue, dispatch }) => {
        try {
            const doctor = await update_doctor_service(id, data);
            dispatch(fetchDoctorsThunk());
            return doctor;
        } catch (err) {
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to update doctor.');
        }
    }
);

export const deleteDoctorThunk = createAsyncThunk(
    'doctors/delete',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await delete_doctor_service(id);
            dispatch(fetchDoctorsThunk());
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to delete doctor.');
        }
    }
);
