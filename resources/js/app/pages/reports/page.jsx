import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Head } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection from './_sections/header-section';
import FiltersSection from './_sections/filters-section';
import ChartsSection from './_sections/charts-section';
import TableSection from './_sections/table-section';
import { fetchReportsSummaryThunk } from './_redux/report-thunk';

export default function ReportsPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchReportsSummaryThunk({ days: 7 }));
    }, [dispatch]);

    return (
        <Layout>
            <Head title="Reports" />
            <HeaderSection />
            <FiltersSection />
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
                <ChartsSection />
                <TableSection />
            </div>
        </Layout>
    );
}
