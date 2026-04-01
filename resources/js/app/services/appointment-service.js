import axios from 'axios';

export async function get_appointments_service(params = {}) {
    const res = await axios.get('/api/appointments', { params });
    return res.data;
}

export async function create_appointment_service(data) {
    const res = await axios.post('/api/appointments', data);
    return res.data;
}

export async function update_appointment_service(id, data) {
    const res = await axios.put(`/api/appointments/${id}`, data);
    return res.data;
}

export async function cancel_appointment_service(id) {
    const res = await axios.patch(`/api/appointments/${id}/cancel`);
    return res.data;
}
