import axios from "axios";

export async function create_user_service(data) {
    const res = await axios.post('/api/usermanagement', data);
    return res;
}

export async function get_users_service() {
    const res = await axios.get('/api/usermanagement');
    return res.data.response;
}

export async function get_user_by_id_service(id) {
    const res = await axios.get('/api/usermanagement/' + id);
    return res.data.response;
}

// Update user service
export async function update_user_service(userId, data) {
    const res = await axios.put(`/api/usermanagement/${userId}`, data);
    return res.data.response;
}

export async function delete_user_service(userId) {
    const res = await axios.delete(`/api/usermanagement/${userId}`);
    return res.data;
}
