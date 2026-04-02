import { createSlice } from '@reduxjs/toolkit';
import { submitBookingThunk, fetchBookingServicesThunk, fetchBookingDoctorsThunk } from './book-now-thunk';

const bookNowSlice = createSlice({
    name: 'bookNow',
    initialState: {
        step: 1,          // 1 = service, 2 = doctor, 3 = date/time, 4 = confirm
        booking: {
            service:          '',
            service_category: '',
            doctor_name:      '',
            date:             '',
            time:             '',
            notes:            '',
        },
        bookingServices: [],
        bookingServicesLoading: false,
        bookingDoctors: [],
        bookingDoctorsLoading: false,
        selectedDoctor: null,
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
            // When category changes, clear cached doctors so the step re-fetches
            if ('service_category' in action.payload &&
                action.payload.service_category !== state.booking.service_category) {
                state.bookingDoctors = [];
                state.booking.doctor_name = '';
            }
            state.booking = { ...state.booking, ...action.payload };
        },
        setSelectedDoctor(state, action) {
            state.selectedDoctor = action.payload;
        },
        resetBooking(state) {
            state.step = 1;
            state.booking = { service: '', service_category: '', doctor_name: '', date: '', time: '', notes: '' };
            state.bookingDoctors = [];
            state.selectedDoctor = null;
            state.submitted = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookingServicesThunk.pending,   (s) => { s.bookingServicesLoading = true; })
            .addCase(fetchBookingServicesThunk.fulfilled, (s, a) => { s.bookingServicesLoading = false; s.bookingServices = a.payload; })
            .addCase(fetchBookingServicesThunk.rejected,  (s) => { s.bookingServicesLoading = false; })

            .addCase(fetchBookingDoctorsThunk.pending,   (s) => { s.bookingDoctorsLoading = true; })
            .addCase(fetchBookingDoctorsThunk.fulfilled, (s, a) => { s.bookingDoctorsLoading = false; s.bookingDoctors = a.payload ?? []; })
            .addCase(fetchBookingDoctorsThunk.rejected,  (s) => { s.bookingDoctorsLoading = false; })

            .addCase(submitBookingThunk.pending,   (s) => { s.submitting = true; s.error = null; })
            .addCase(submitBookingThunk.fulfilled,  (s) => { s.submitting = false; s.submitted = true; })
            .addCase(submitBookingThunk.rejected,   (s, a) => { s.submitting = false; s.error = a.payload; });
    },
});

export const { nextStep, prevStep, goToStep, setBookingField, setSelectedDoctor, resetBooking } = bookNowSlice.actions;
export default bookNowSlice.reducer;
