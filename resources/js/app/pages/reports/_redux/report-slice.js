import { createSlice } from '@reduxjs/toolkit';
import { fetchReportsSummaryThunk } from './report-thunk';

const reportSlice = createSlice({
    name: 'reports',
    initialState: {
        summary: { labels: [], by_date: [], by_doctor: [] },
        filters: { days: 7 },
        loading: false,
        error: null,
    },
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReportsSummaryThunk.pending,   (s) => { s.loading = true; s.error = null; })
            .addCase(fetchReportsSummaryThunk.fulfilled, (s, a) => { s.loading = false; s.summary = a.payload.data ?? a.payload; })
            .addCase(fetchReportsSummaryThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
    },
});

export const { setFilters } = reportSlice.actions;
export default reportSlice.reducer;
