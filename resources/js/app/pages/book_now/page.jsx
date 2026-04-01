import { useSelector } from 'react-redux';
import { Head } from '@inertiajs/react';
import Layout from '../layout';
import HeaderSection from './_sections/header-section';
import StepperSection from './_sections/stepper-section';
import ServiceStepSection from './_sections/service-step-section';
import DoctorStepSection from './_sections/doctor-step-section';
import DateTimeStepSection from './_sections/datetime-step-section';
import ConfirmStepSection from './_sections/confirm-step-section';
import SuccessSection from './_sections/success-section';

export default function BookNowPage() {
    const { step, submitted } = useSelector((s) => s.bookNow);

    return (
        <Layout>
            <Head title="Book Appointment" />

            <div className="max-w-2xl mx-auto">
                <HeaderSection />

                {submitted ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <SuccessSection />
                    </div>
                ) : (
                    <>
                        <StepperSection />

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                            {step === 1 && <ServiceStepSection />}
                            {step === 2 && <DoctorStepSection />}
                            {step === 3 && <DateTimeStepSection />}
                            {step === 4 && <ConfirmStepSection />}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
