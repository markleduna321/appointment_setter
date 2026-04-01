import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Head } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection from './_sections/header-section';
import CreateAdminSection from './_sections/create-admin-section';
import AdminsListSection from './_sections/admins-list-section';
import { fetchStaffUsersThunk } from './_redux/user-management-thunk';

export default function UserManagementPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchStaffUsersThunk());
    }, [dispatch]);

    return (
        <Layout>
            <Head title="User Management" />
            <HeaderSection />

            <div className="grid xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                    <AdminsListSection />
                </div>
                <div>
                    <CreateAdminSection />
                </div>
            </div>
        </Layout>
    );
}
