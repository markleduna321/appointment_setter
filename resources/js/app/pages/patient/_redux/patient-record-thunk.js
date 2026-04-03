import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    get_patient_records_service,
    get_latest_patient_record_service,
    get_patient_record_service,
    create_patient_record_service,
    update_patient_record_service,
    delete_patient_record_service,
} from '../../../services/patient-record-service';

export const fetchPatientRecordsThunk = createAsyncThunk(
    'patientRecords/fetchAll',
    async (patientId, { rejectWithValue }) => {
        try {
            const records = await get_patient_records_service(patientId);
            return { patientId, records };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load records.');
        }
    }
);

export const fetchLatestPatientRecordThunk = createAsyncThunk(
    'patientRecords/fetchLatest',
    async (patientId, { rejectWithValue }) => {
        try {
            const record = await get_latest_patient_record_service(patientId);
            return { patientId, record };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load record.');
        }
    }
);

export const fetchPatientRecordThunk = createAsyncThunk(
    'patientRecords/fetchOne',
    async ({ patientId, recordId }, { rejectWithValue }) => {
        try {
            return await get_patient_record_service(patientId, recordId);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load record.');
        }
    }
);

export const createPatientRecordThunk = createAsyncThunk(
    'patientRecords/create',
    async ({ patientId, data }, { rejectWithValue, dispatch }) => {
        try {
            const record = await create_patient_record_service(patientId, data);
            dispatch(fetchPatientRecordsThunk(patientId));
            return record;
        } catch (err) {
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to create record.');
        }
    }
);

export const updatePatientRecordThunk = createAsyncThunk(
    'patientRecords/update',
    async ({ patientId, recordId, data }, { rejectWithValue, dispatch }) => {
        try {
            const record = await update_patient_record_service(patientId, recordId, data);
            dispatch(fetchPatientRecordsThunk(patientId));
            return record;
        } catch (err) {
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to update record.');
        }
    }
);

export const deletePatientRecordThunk = createAsyncThunk(
    'patientRecords/delete',
    async ({ patientId, recordId }, { rejectWithValue, dispatch }) => {
        try {
            await delete_patient_record_service(patientId, recordId);
            dispatch(fetchPatientRecordsThunk(patientId));
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to delete record.');
        }
    }
);
