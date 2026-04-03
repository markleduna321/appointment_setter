import { createAsyncThunk } from '@reduxjs/toolkit';
import { get_advanced_report_service } from '../../../services/advance-reports-service';

export const fetchAdvancedReportThunk = createAsyncThunk(
    'advanceReports/fetch',
    async (params = {}, { rejectWithValue }) => {
        try {
            return await get_advanced_report_service(params);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load advanced report.');
        }
    }
);
