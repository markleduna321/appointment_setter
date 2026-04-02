import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../pages/login/_redux/auth-slice';
import dashboardReducer from '../pages/dashboard/_redux/dashboard-slice';
import appointmentsReducer from '../pages/appointments/_redux/appointment-slice';
import bookNowReducer from '../pages/book_now/_redux/book-now-slice';
import userManagementReducer from '../pages/user_management/_redux/user-management-slice';
import doctorsReducer from '../pages/doctors/_redux/doctor-slice';
import servicesReducer from '../pages/services/_redux/service-slice';
import scheduleReducer from '../pages/schedule/_redux/schedule-slice';
import patientsReducer from '../pages/patient/_redux/patient-slice';
import reportsReducer from '../pages/reports/_redux/report-slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        appointments: appointmentsReducer,
        bookNow: bookNowReducer,
        userManagement: userManagementReducer,
        doctors: doctorsReducer,
        patients: patientsReducer,
        reports: reportsReducer,
        services: servicesReducer,
        schedule: scheduleReducer,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;