import axios from 'axios';

export async function get_staff_users_service() {
    const res = await axios.get('/api/usermanagement');
    return res.data.response;
}

export async function create_staff_user_service(data) {
    const res = await axios.post('/api/usermanagement', data);
    return res.data.response;
}

export async function update_staff_user_service(id, data) {
    const res = await axios.put(`/api/usermanagement/${id}`, data);
    return res.data.response;
}

export async function delete_staff_user_service(id) {
    const res = await axios.delete(`/api/usermanagement/${id}`);
    return res.data;
}
