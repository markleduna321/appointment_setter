import axios from 'axios';

export const get_services_service = (params = {}) =>
    axios.get('/api/services', { params }).then((r) => r.data);

export const create_service_service = (data) =>
    axios.post('/api/services', data).then((r) => r.data);

export const update_service_service = (id, data) =>
    axios.put(`/api/services/${id}`, data).then((r) => r.data);

export const delete_service_service = (id) =>
    axios.delete(`/api/services/${id}`).then((r) => r.data);
