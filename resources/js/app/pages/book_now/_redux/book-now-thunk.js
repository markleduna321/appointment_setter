import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
