import axios from 'axios';

export const get_schedule_service = (params = {}) =>
    axios.get('/api/appointments', { params: { ...params, per_page: 200 } }).then((r) => r.data);

export const update_schedule_appointment_service = (id, data) =>
    axios.put(`/api/appointments/${id}`, data).then((r) => r.data);

export const cancel_schedule_appointment_service = (id) =>
    axios.patch(`/api/appointments/${id}/cancel`).then((r) => r.data);
