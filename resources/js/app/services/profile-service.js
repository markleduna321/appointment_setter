import axios from 'axios';

export async function get_profile_service() {
    const res = await axios.get('/api/profile');
    return res.data.data ?? res.data;
}

export async function update_profile_service(data) {
    const res = await axios.patch('/api/profile', data);
    return res.data.data ?? res.data;
}

export async function update_password_service(data) {
    const res = await axios.put('/api/profile/password', data);
    return res.data;
}

export async function delete_profile_service(password) {
    const res = await axios.delete('/api/profile', { data: { password } });
    return res.data;
}
