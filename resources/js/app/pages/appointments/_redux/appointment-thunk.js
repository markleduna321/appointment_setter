import { createAsyncThunk } from '@reduxjs/toolkit';
import { get_appointments_service, create_appointment_service, update_appointment_service, cancel_appointment_service } from '../../../services/appointment-service';

export const fetchAppointmentsThunk = createAsyncThunk(
    'appointments/fetchAll',
    async (params, { rejectWithValue }) => {
        try { return await get_appointments_service(params); }
        catch (err) { return rejectWithValue(err.response?.data?.message ?? 'Failed to load appointments.'); }
    }
);

export const createAppointmentThunk = createAsyncThunk(
    'appointments/create',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const res = await create_appointment_service(data);
            const { filters, pagination } = getState().appointments;
            dispatch(fetchAppointmentsThunk({ ...filters, page: pagination.page, per_page: pagination.perPage }));
            return res;
        } catch (err) { return rejectWithValue(err.response?.data?.message ?? 'Failed to create appointment.'); }
    }
);

export const updateAppointmentThunk = createAsyncThunk(
    'appointments/update',
    async ({ id, data }, { rejectWithValue, dispatch, getState }) => {
        try {
            const res = await update_appointment_service(id, data);
            const { filters, pagination } = getState().appointments;
            dispatch(fetchAppointmentsThunk({ ...filters, page: pagination.page, per_page: pagination.perPage }));
            return res;
        } catch (err) { return rejectWithValue(err.response?.data?.message ?? 'Failed to update appointment.'); }
    }
);

export const cancelAppointmentThunk = createAsyncThunk(
    'appointments/cancel',
    async (id, { rejectWithValue, dispatch, getState }) => {
        try {
            const res = await cancel_appointment_service(id);
            const { filters, pagination } = getState().appointments;
            dispatch(fetchAppointmentsThunk({ ...filters, page: pagination.page, per_page: pagination.perPage }));
            return res;
        } catch (err) { return rejectWithValue(err.response?.data?.message ?? 'Failed to cancel appointment.'); }
    }
);
