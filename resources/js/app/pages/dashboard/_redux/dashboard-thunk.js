import { createAsyncThunk } from '@reduxjs/toolkit';
import { get_dashboard_summary_service } from '../../../services/dashboard-service';

export const fetchDashboardSummaryThunk = createAsyncThunk(
    'dashboard/fetchSummary',
    async (_, { rejectWithValue }) => {
        try {
            return await get_dashboard_summary_service();
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ?? 'Failed to load dashboard.'
            );
        }
    }
);
