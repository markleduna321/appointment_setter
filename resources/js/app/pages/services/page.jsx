import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection from './_sections/header-section';
import StatsSection from './_sections/stats-section';
import FiltersSection from './_sections/filters-section';
import ServicesGridSection from './_sections/services-grid-section';
import ServiceModalSection from './_sections/service-modal-section';
import { fetchServicesThunk } from './_redux/service-thunk';

export default function ServicesPage() {
    const dispatch = useDispatch();
    const { auth } = usePage().props;
    const role = auth?.user?.role;
    const isAdmin = role === 'admin' || role === 'super_admin';

    useEffect(() => {
        dispatch(fetchServicesThunk({}));
    }, [dispatch]);

    return (
        <Layout>
            <Head title="Services" />
            <HeaderSection />
            <StatsSection />
            <FiltersSection />
            <ServicesGridSection />
            {isAdmin && <ServiceModalSection />}
        </Layout>
    );
}
