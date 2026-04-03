import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../layout';

// Admin sections
import HeaderSection from './_sections/header-section';
import StatsSection from './_sections/stats-section';
import QuickActionsSection from './_sections/quick-actions-section';
import ChartsSection from './_sections/charts-section';
import DashboardTableSection from './_sections/dashboard-table-section';
import AnnouncementsSection from './_sections/announcements-section';

// Doctor sections
import DoctorHeaderSection from './_sections/doctor-header-section';
import DoctorUpcomingSection from './_sections/doctor-upcoming-section';

// Appointment setter sections
import SetterHeaderSection from './_sections/setter-header-section';
import SetterUpcomingSection from './_sections/setter-upcoming-section';

// Patient sections
import PatientHeaderSection from './_sections/patient-header-section';
import PatientStatsSection from './_sections/patient-stats-section';
import PatientQuickActionsSection from './_sections/patient-quick-actions-section';
import PatientUpcomingSection from './_sections/patient-upcoming-section';
import AppointmentModalSection from '../appointments/_sections/appointment-modal-section';

import { fetchDashboardSummaryThunk } from './_redux/dashboard-thunk';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin  = role === 'admin' || role === 'super_admin';
    const isDoctor = role === 'doctor';
    const isSetter = role === 'appointment_setter';

    useEffect(() => {
        dispatch(fetchDashboardSummaryThunk());
    }, [dispatch]);

    return (
        <Layout>
            <Head title="Dashboard" />

            {isAdmin ? (
                <>
                    <HeaderSection />
                    <StatsSection />

                    <div className="mb-6">
                        <ChartsSection />
                    </div>

                    <div className="grid xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2">
                            <DashboardTableSection />
                        </div>
                        <AnnouncementsSection />
                    </div>
                </>
            ) : isDoctor ? (
                <>
                    <DoctorHeaderSection />
                    <div className="grid xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2">
                            <DoctorUpcomingSection />
                        </div>
                        <AnnouncementsSection />
                    </div>
                </>
            ) : isSetter ? (
                <>
                    <SetterHeaderSection />
                    <div className="grid xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2">
                            <SetterUpcomingSection />
                        </div>
                        <AnnouncementsSection />
                    </div>
                    <AppointmentModalSection />
                </>
            ) : (
                <>
                    <PatientHeaderSection />
                    <PatientStatsSection />
                    <PatientQuickActionsSection />

                    <div className="grid xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2">
                            <PatientUpcomingSection />
                        </div>
                        <AnnouncementsSection />
                    </div>
                </>
            )}
            <AppointmentModalSection />
        </Layout>
    );
}
