import Layout from '../layout';
import { Head } from '@inertiajs/react';
import HeaderSection from './_sections/header-section';
import ProfileInfoSection from './_sections/profile-info-section';
import ProfilePasswordSection from './_sections/profile-password-section';
import ProfileDeleteSection from './_sections/profile-delete-section';

export default function ProfilePage() {
    return (
        <Layout>
            <Head title="Profile" />
            <HeaderSection />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <ProfileInfoSection />
                </div>

                <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <ProfilePasswordSection />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <ProfileDeleteSection />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
