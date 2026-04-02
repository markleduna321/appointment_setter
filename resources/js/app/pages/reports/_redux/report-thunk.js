import { createAsyncThunk } from '@reduxjs/toolkit';
import { get_appointments_summary_service } from '../../../services/reports-service';

export const fetchReportsSummaryThunk = createAsyncThunk(
    'reports/fetchSummary',
    async (params = {}, { rejectWithValue }) => {
        try {
            return await get_appointments_summary_service(params);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load report summary.');
        }
    }
);
