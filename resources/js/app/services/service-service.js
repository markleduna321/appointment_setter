import axios from 'axios';

export async function get_services_service(params = {}) {
    const res = await axios.get('/api/services', { params });
    return res.data;
}

export async function get_service_service(id) {
    const res = await axios.get(`/api/services/${id}`);
    return res.data;
}

export async function create_service_service(data) {
    const res = await axios.post('/api/services', data);
    return res.data;
}

export async function update_service_service(id, data) {
    if (data instanceof FormData) {
        // PHP only parses $_FILES on POST; use the POST alias route for file uploads
        const res = await axios.post(`/api/services/${id}/update`, data);
        return res.data;
    }
    const res = await axios.put(`/api/services/${id}`, data);
    return res.data;
}

export async function delete_service_service(id) {
    const res = await axios.delete(`/api/services/${id}`);
    return res.data;
}
