import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    get_schedule_service,
    update_schedule_appointment_service,
    cancel_schedule_appointment_service,
} from '../../../services/schedule-service';

export const fetchScheduleThunk = createAsyncThunk(
    'schedule/fetchWeek',
    async ({ date_from, date_to }, { rejectWithValue }) => {
        try {
            const response = await get_schedule_service({ date_from, date_to });
            // API returns paginated { data: [...], ... }
            return response.data ?? response;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load schedule.');
        }
    }
);

export const updateScheduleApptStatusThunk = createAsyncThunk(
    'schedule/updateStatus',
    async ({ id, status, date_from, date_to }, { rejectWithValue, dispatch }) => {
        try {
            let result;
            if (status === 'cancelled') {
                result = await cancel_schedule_appointment_service(id);
            } else {
                result = await update_schedule_appointment_service(id, { status });
            }
            dispatch(fetchScheduleThunk({ date_from, date_to }));
            return result;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to update appointment.');
        }
    }
);
