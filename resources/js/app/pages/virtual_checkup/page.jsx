import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Layout from '../layout';
import VcHeroSection from './sections/vc-hero-section';
import VcBookingSection from './sections/vc-booking-section';
import VcAppointmentsSection from './sections/vc-appointments-section';
import VcRoomSection from './sections/vc-room-section';
import { resetBooking, setBookingField } from '../book_now/_redux/book-now-slice';

export default function VirtualCheckupPage() {
    const dispatch   = useDispatch();
    const { submitted } = useSelector((s) => s.bookNow);
    const { props }  = usePage();
    const authUser   = props.auth?.user;

    const [appointments, setAppointments] = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [activeAppt,   setActiveAppt]   = useState(null);
    const [bookingOpen,  setBookingOpen]  = useState(false);

    // Always start fresh with visit_type pre-set to video_call
    useEffect(() => {
        dispatch(resetBooking());
        dispatch(setBookingField({ visit_type: 'video_call' }));
    }, [dispatch]);

    // Fetch (or re-fetch after a successful booking) only virtual appointments
    useEffect(() => {
        setLoading(true);
        axios.get('/api/appointments', { params: { per_page: 100 } })
            .then((res) => {
                const all = res.data?.data ?? res.data ?? [];
                setAppointments(all.filter((a) => a.visit_type === 'video_call'));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [submitted]);

    const role = authUser?.role;
    const isPatient = !role || role === 'patient';

    return (
        <>
            {activeAppt && (
                <VcRoomSection
                    appointment={activeAppt}
                    authUser={authUser}
                    onClose={() => setActiveAppt(null)}
                />
            )}

            <Layout>
                <Head title="Virtual Check Up" />
                <VcHeroSection onApply={isPatient ? () => setBookingOpen(true) : null} />
                {isPatient && (
                    <VcBookingSection
                        open={bookingOpen}
                        onClose={() => setBookingOpen(false)}
                    />
                )}
                <VcAppointmentsSection
                    appointments={appointments}
                    loading={loading}
                    onJoin={setActiveAppt}
                    role={role}
                />
            </Layout>
        </>
    );
}

