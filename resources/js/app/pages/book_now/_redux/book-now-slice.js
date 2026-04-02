import { createSlice } from '@reduxjs/toolkit';
import { submitBookingThunk, fetchBookingServicesThunk } from './book-now-thunk';

const bookNowSlice = createSlice({
    name: 'bookNow',
    initialState: {
        step: 1,          // 1 = service, 2 = doctor, 3 = date/time, 4 = confirm
        booking: {
            service:      '',
            doctor_name:  '',
            date:         '',
            time:         '',
            notes:        '',
        },
        bookingServices: [],
        bookingServicesLoading: false,
        submitted: false,
        submitting: false,
        error: null,
    },
    reducers: {
        nextStep(state) {
            if (state.step < 4) state.step += 1;
        },
        prevStep(state) {
            if (state.step > 1) state.step -= 1;
        },
        goToStep(state, action) {
            state.step = action.payload;
        },
        setBookingField(state, action) {
            state.booking = { ...state.booking, ...action.payload };
        },
        resetBooking(state) {
            state.step = 1;
            state.booking = { service: '', doctor_name: '', date: '', time: '', notes: '' };
            state.submitted = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookingServicesThunk.pending,   (s) => { s.bookingServicesLoading = true; })
            .addCase(fetchBookingServicesThunk.fulfilled, (s, a) => { s.bookingServicesLoading = false; s.bookingServices = a.payload; })
            .addCase(fetchBookingServicesThunk.rejected,  (s) => { s.bookingServicesLoading = false; })

            .addCase(submitBookingThunk.pending,   (s) => { s.submitting = true; s.error = null; })
            .addCase(submitBookingThunk.fulfilled,  (s) => { s.submitting = false; s.submitted = true; })
            .addCase(submitBookingThunk.rejected,   (s, a) => { s.submitting = false; s.error = a.payload; });
    },
});

export const { nextStep, prevStep, goToStep, setBookingField, resetBooking } = bookNowSlice.actions;
export default bookNowSlice.reducer;
