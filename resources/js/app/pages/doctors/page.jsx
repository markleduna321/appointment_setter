import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection from './_sections/header-section';
import StatsSection from './_sections/stats-section';
import FiltersSection from './_sections/filters-section';
import DoctorsGridSection from './_sections/doctors-grid-section';
import DoctorModalSection from './_sections/doctor-modal-section';
import { fetchDoctorsThunk } from './_redux/doctor-thunk';

export default function DoctorsPage() {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isSuperAdmin = role === 'super_admin';

    useEffect(() => {
        dispatch(fetchDoctorsThunk({}));
    }, [dispatch]);

    return (
        <Layout>
            <Head title="Doctors" />
            <HeaderSection />
            <StatsSection />
            <FiltersSection />
            <DoctorsGridSection />
            {isSuperAdmin && <DoctorModalSection />}
        </Layout>
    );
}
