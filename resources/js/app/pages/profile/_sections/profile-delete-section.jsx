import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import { deleteProfileThunk } from '../_redux/profile-thunk';

export default function ProfileDeleteSection() {
    const dispatch = useDispatch();
    const { submitting, formError } = useSelector((s) => s.profile);

    const [confirming, setConfirming] = useState(false);
    const [password, setPassword] = useState('');

    const open = () => setConfirming(true);
    const close = () => { setConfirming(false); setPassword(''); };

    const deleteUser = async (e) => {
        e.preventDefault();
        const res = await dispatch(deleteProfileThunk(password));
        if (!res.error) {
            // on success the backend logs out and deletes; redirect to /
            window.location.href = '/';
        }
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Delete Account</h2>
                <p className="mt-1 text-sm text-gray-600">Permanently delete your account and data.</p>
            </header>

            <div className="mt-4">
                <DangerButton onClick={open}>Delete Account</DangerButton>
            </div>

            <Modal show={confirming} onClose={close}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Are you sure?</h2>
                    <p className="mt-2 text-sm text-gray-600">Enter your password to confirm account deletion.</p>

                    <div className="mt-4">
                        <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full" />
                        {formError && <p className="text-sm text-red-600 mt-2">{formError}</p>}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
                        <DangerButton className="ms-3" disabled={submitting}>{submitting ? 'Deleting…' : 'Delete Account'}</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
