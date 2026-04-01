import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Head } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection, { getWeekEnd } from './_sections/header-section';
import WeeklyCalendarSection from './_sections/weekly-calendar-section';
import AppointmentDetailSection from './_sections/appointment-detail-section';
import { fetchScheduleThunk } from './_redux/schedule-thunk';

export default function SchedulePage() {
    const dispatch = useDispatch();
    const { weekStart } = useSelector((s) => s.schedule);

    // Re-fetch whenever the week changes
    useEffect(() => {
        const weekEnd = getWeekEnd(weekStart);
        dispatch(fetchScheduleThunk({ date_from: weekStart, date_to: weekEnd }));
    }, [weekStart, dispatch]);

    return (
        <Layout>
            <Head title="Schedule" />
            <HeaderSection />
            <WeeklyCalendarSection />
            <AppointmentDetailSection />
        </Layout>
    );
}
