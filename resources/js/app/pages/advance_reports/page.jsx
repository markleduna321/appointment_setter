import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Head } from '@inertiajs/react';
import Layout from '../layout';
import AdvHeaderSection from './_sections/adv-header-section';
import AdvFiltersSection from './_sections/adv-filters-section';
import AdvKpiSection from './_sections/adv-kpi-section';
import AdvTrendsSection from './_sections/adv-trends-section';
import AdvDoctorTable from './_sections/adv-doctor-table';
import AdvServiceSection from './_sections/adv-service-section';
import AdvStatusSection from './_sections/adv-status-section';
import { fetchAdvancedReportThunk } from './_redux/advance-report-thunk';

export default function AdvanceReportsPage() {
    const dispatch = useDispatch();
    const { filters } = useSelector((s) => s.advanceReports);

    useEffect(() => {
        dispatch(fetchAdvancedReportThunk({
            date_from: filters.date_from,
            date_to:   filters.date_to,
        }));
    }, [dispatch]);

    return (
        <Layout>
            <Head title="Advanced Reports" />
            <AdvHeaderSection />
            <AdvFiltersSection />
            <AdvKpiSection />
            <AdvTrendsSection />
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
                <AdvDoctorTable />
                <AdvServiceSection />
            </div>
            <AdvStatusSection />
        </Layout>
    );
}
