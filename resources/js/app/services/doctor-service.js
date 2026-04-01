import axios from 'axios';

export async function get_doctors_service(params = {}) {
    const res = await axios.get('/api/doctors', { params });
    return res.data.data;
}

export async function create_doctor_service(data) {
    const res = await axios.post('/api/doctors', data);
    return res.data.data;
}

export async function update_doctor_service(id, data) {
    const res = await axios.put(`/api/doctors/${id}`, data);
    return res.data.data;
}

export async function delete_doctor_service(id) {
    const res = await axios.delete(`/api/doctors/${id}`);
    return res.data;
}
