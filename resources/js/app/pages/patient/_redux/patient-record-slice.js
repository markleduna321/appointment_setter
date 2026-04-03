import { createSlice } from '@reduxjs/toolkit';
import {
    fetchPatientRecordsThunk,
    fetchLatestPatientRecordThunk,
    fetchPatientRecordThunk,
    createPatientRecordThunk,
    updatePatientRecordThunk,
    deletePatientRecordThunk,
} from './patient-record-thunk';

const patientRecordSlice = createSlice({
    name: 'patientRecords',
    initialState: {
        // map of patientId → records[]
        recordsByPatient: {},
        // currently viewed full record
        activeRecord: null,
        // drawer state
        drawerOpen: false,
        drawerPatient: null,
        // checkup modal state
        recordModalOpen: false,
        recordModalMode: 'view',   // 'view' | 'add' | 'edit'
        selectedRecord: null,
        // loading flags
        loadingRecords: false,
        loadingRecord: false,
        submitting: false,
        formError: null,
        error: null,
    },
    reducers: {
        openDrawer(state, action) {
            state.drawerOpen = true;
            state.drawerPatient = action.payload;
            state.recordsByPatient[action.payload.id] = state.recordsByPatient[action.payload.id] ?? [];
        },
        closeDrawer(state) {
            state.drawerOpen = false;
            state.drawerPatient = null;
        },
        openRecordModal(state, action) {
            // action.payload: { mode: 'view'|'add'|'edit', record?: object }
            state.recordModalOpen = true;
            state.recordModalMode = action.payload.mode ?? 'view';
            state.selectedRecord = action.payload.record ?? null;
            state.formError = null;
        },
        closeRecordModal(state) {
            state.recordModalOpen = false;
            state.selectedRecord = null;
            state.formError = null;
        },
        clearActiveRecord(state) {
            state.activeRecord = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchAll
            .addCase(fetchPatientRecordsThunk.pending,   (s) => { s.loadingRecords = true; s.error = null; })
            .addCase(fetchPatientRecordsThunk.fulfilled, (s, a) => {
                s.loadingRecords = false;
                s.recordsByPatient[a.payload.patientId] = a.payload.records;
            })
            .addCase(fetchPatientRecordsThunk.rejected,  (s, a) => { s.loadingRecords = false; s.error = a.payload; })

            // fetchLatest — open modal immediately in loading state
            .addCase(fetchLatestPatientRecordThunk.pending,   (s) => {
                s.loadingRecord = true;
                s.recordModalOpen = true;
                s.recordModalMode = 'view';
                s.selectedRecord = null;
            })
            .addCase(fetchLatestPatientRecordThunk.fulfilled, (s, a) => {
                s.loadingRecord = false;
                s.activeRecord = a.payload.record;
                s.selectedRecord = a.payload.record;
            })
            .addCase(fetchLatestPatientRecordThunk.rejected,  (s, a) => {
                s.loadingRecord = false;
                s.recordModalOpen = false;
                s.error = a.payload;
            })

            // fetchOne
            .addCase(fetchPatientRecordThunk.pending,   (s) => {
                s.loadingRecord = true;
                s.recordModalOpen = true;
                s.recordModalMode = 'view';
                s.selectedRecord = null;
            })
            .addCase(fetchPatientRecordThunk.fulfilled, (s, a) => {
                s.loadingRecord = false;
                s.selectedRecord = a.payload;
            })
            .addCase(fetchPatientRecordThunk.rejected,  (s, a) => {
                s.loadingRecord = false;
                s.recordModalOpen = false;
                s.error = a.payload;
            })

            // create
            .addCase(createPatientRecordThunk.pending,   (s) => { s.submitting = true; s.formError = null; })
            .addCase(createPatientRecordThunk.fulfilled, (s, a) => {
                s.submitting = false;
                s.recordModalOpen = false;
                s.selectedRecord = null;
            })
            .addCase(createPatientRecordThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })

            // update
            .addCase(updatePatientRecordThunk.pending,   (s) => { s.submitting = true; s.formError = null; })
            .addCase(updatePatientRecordThunk.fulfilled, (s) => {
                s.submitting = false;
                s.recordModalOpen = false;
                s.selectedRecord = null;
            })
            .addCase(updatePatientRecordThunk.rejected,  (s, a) => { s.submitting = false; s.formError = a.payload; })

            // delete
            .addCase(deletePatientRecordThunk.pending,   (s) => { s.loadingRecords = true; })
            .addCase(deletePatientRecordThunk.fulfilled, (s) => { s.loadingRecords = false; })
            .addCase(deletePatientRecordThunk.rejected,  (s, a) => { s.loadingRecords = false; s.error = a.payload; });
    },
});

export const {
    openDrawer,
    closeDrawer,
    openRecordModal,
    closeRecordModal,
    clearActiveRecord,
} = patientRecordSlice.actions;

export default patientRecordSlice.reducer;
