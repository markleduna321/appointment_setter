import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection from './_sections/header-section';
import StatsSection from './_sections/stats-section';
import FiltersSection from './_sections/filters-section';
import AppointmentsTableSection from './_sections/appointments-table-section';
import AppointmentModalSection from './_sections/appointment-modal-section';
import { fetchAppointmentsThunk } from './_redux/appointment-thunk';

export default function AppointmentsPage() {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const isPatient = auth?.user?.role === 'patient';

    useEffect(() => {
        dispatch(fetchAppointmentsThunk({}));
    }, [dispatch]);

    return (
        <Layout>
            <Head title={isPatient ? 'My Appointments' : 'Appointments'} />
            <HeaderSection />
            <StatsSection />
            <FiltersSection />
            <AppointmentsTableSection />
            {/* Modal is for admin/staff only — patients book via /appointments/new */}
            {!isPatient && <AppointmentModalSection />}
        </Layout>
    );
}
