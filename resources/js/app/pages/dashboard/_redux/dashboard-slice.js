import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardSummaryThunk } from './dashboard-thunk';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: {
            todays_appointments: 0,
            pending_bookings: 0,
            available_doctors: 0,
            new_notifications: 0,
        },
        upcoming_appointments: [],
        announcements: [],
        quick_stats: {
            appointments_this_week: [0, 0, 0, 0, 0, 0, 0],
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardSummaryThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardSummaryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.upcoming_appointments = action.payload.upcoming_appointments;
                state.announcements = action.payload.announcements;
                state.quick_stats = action.payload.quick_stats;
                state.user = action.payload.user;
            })
            .addCase(fetchDashboardSummaryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
