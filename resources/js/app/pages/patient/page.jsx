import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection from './_sections/header-section';
import FiltersSection from './_sections/filters-section';
import PatientsGridSection from './_sections/patients-grid-section';
import PatientModalSection from './_sections/patient-modal-section';
import PatientProfileDrawer from './_sections/patient-profile-drawer';
import CheckupRecordModal from './_sections/checkup-record-modal';
import { fetchPatientsThunk } from './_redux/patient-thunk';
import AppointmentModalSection from '../appointments/_sections/appointment-modal-section';

export default function PatientsPage() {
	const dispatch = useDispatch();
	const { auth } = usePage().props;
	const role = auth?.user?.role;
	const isAdmin = role === 'admin' || role === 'super_admin';
	const canManagePatients = isAdmin || role === 'appointment_setter';

	const drawerPatient = useSelector((s) => s.patientRecords.drawerPatient);

	useEffect(() => {
		dispatch(fetchPatientsThunk({}));
	}, [dispatch]);

	return (
		<Layout>
			<Head title="Patients" />
			<HeaderSection />
			<FiltersSection />
			<PatientsGridSection />
			{canManagePatients && <PatientModalSection />}
			<PatientProfileDrawer />
			<CheckupRecordModal patientId={drawerPatient?.id} />
			{isAdmin && <AppointmentModalSection />}
		</Layout>
	);
}

