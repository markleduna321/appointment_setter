import { createSlice } from '@reduxjs/toolkit';
import { fetchAdvancedReportThunk } from './advance-report-thunk';

const today = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 29);

const toISO = (d) => d.toISOString().slice(0, 10);

const advanceReportSlice = createSlice({
    name: 'advanceReports',
    initialState: {
        kpi: {
            total: 0, completed: 0, cancelled: 0, pending: 0, confirmed: 0,
            avg_per_day: 0, completion_rate: 0, unique_patients: 0,
        },
        by_date:    [],
        by_doctor:  [],
        by_service: [],
        by_status:  [],
        by_source:  [],
        doctors:    [],
        filters: {
            date_from: toISO(thirtyDaysAgo),
            date_to:   toISO(today),
            doctor:    '',
        },
        loading: false,
        error:   null,
    },
    reducers: {
        setAdvFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdvancedReportThunk.pending,   (s) => { s.loading = true; s.error = null; })
            .addCase(fetchAdvancedReportThunk.fulfilled, (s, a) => {
                s.loading = false;
                const d = a.payload?.data ?? {};
                s.kpi        = d.kpi        ?? s.kpi;
                s.by_date    = d.by_date    ?? [];
                s.by_doctor  = d.by_doctor  ?? [];
                s.by_service = d.by_service ?? [];
                s.by_status  = d.by_status  ?? [];
                s.by_source  = d.by_source  ?? [];
                s.doctors    = d.doctors    ?? [];
            })
            .addCase(fetchAdvancedReportThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    },
});

export const { setAdvFilters } = advanceReportSlice.actions;
export default advanceReportSlice.reducer;
