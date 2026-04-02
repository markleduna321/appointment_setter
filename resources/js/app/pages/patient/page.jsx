import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection from './_sections/header-section';
import FiltersSection from './_sections/filters-section';
import PatientsGridSection from './_sections/patients-grid-section';
import PatientModalSection from './_sections/patient-modal-section';
import { fetchPatientsThunk } from './_redux/patient-thunk';

export default function PatientsPage() {
	const dispatch = useDispatch();
	const { auth } = usePage().props;
	const role = auth?.user?.role;
	const isAdmin = role === 'admin' || role === 'super_admin';

	useEffect(() => {
		dispatch(fetchPatientsThunk({}));
	}, [dispatch]);

	return (
		<Layout>
			<Head title="Patients" />
			<HeaderSection />
			<FiltersSection />
			<PatientsGridSection />
			{isAdmin && <PatientModalSection />}
		</Layout>
	);
}

