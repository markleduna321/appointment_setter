import { createSlice } from '@reduxjs/toolkit';
import { fetchScheduleThunk, updateScheduleApptStatusThunk } from './schedule-thunk';

function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
}

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        appointments: [],
        weekStart: getWeekStart(),
        loading: false,
        updating: false,
        error: null,
        selectedAppointment: null,
        detailOpen: false,
    },
    reducers: {
        prevWeek(state) {
            const d = new Date(state.weekStart);
            d.setDate(d.getDate() - 7);
            state.weekStart = d.toISOString().split('T')[0];
        },
        nextWeek(state) {
            const d = new Date(state.weekStart);
            d.setDate(d.getDate() + 7);
            state.weekStart = d.toISOString().split('T')[0];
        },
        goToToday(state) {
            state.weekStart = getWeekStart();
        },
        openDetail(state, action) {
            state.selectedAppointment = action.payload;
            state.detailOpen = true;
        },
        closeDetail(state) {
            state.detailOpen = false;
            state.selectedAppointment = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchScheduleThunk.pending,   (s)    => { s.loading = true; s.error = null; })
            .addCase(fetchScheduleThunk.fulfilled, (s, a) => { s.loading = false; s.appointments = a.payload; })
            .addCase(fetchScheduleThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

            .addCase(updateScheduleApptStatusThunk.pending,   (s)    => { s.updating = true; })
            .addCase(updateScheduleApptStatusThunk.fulfilled, (s)    => { s.updating = false; })
            .addCase(updateScheduleApptStatusThunk.rejected,  (s, a) => { s.updating = false; s.error = a.payload; });
    },
});

export const { prevWeek, nextWeek, goToToday, openDetail, closeDetail } = scheduleSlice.actions;
export default scheduleSlice.reducer;
