import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { get_doctors_service } from '../../../services/doctor-service';

export const fetchBookingServicesThunk = createAsyncThunk(
    'bookNow/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/api/services', { params: { status: 'active' } });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load services.');
        }
    }
);

export const fetchBookingDoctorsThunk = createAsyncThunk(
    'bookNow/fetchDoctors',
    async (_, { rejectWithValue }) => {
        try {
            return await get_doctors_service({ status: 'available' });
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load doctors.');
        }
    }
);

export const submitBookingThunk = createAsyncThunk(
    'bookNow/submit',
    async (bookingData, { rejectWithValue }) => {
        try {
            const res = await axios.post('/api/appointments', bookingData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to submit booking.');
        }
    }
);
