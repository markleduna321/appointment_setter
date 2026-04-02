import axios from 'axios';

export async function get_notifications_service() {
    const res = await axios.get('/api/notifications');
    return res.data.data ?? res.data;
}

export async function mark_notification_read_service(id) {
    const res = await axios.patch(`/api/notifications/${id}/read`);
    return res.data.data ?? res.data;
}

export async function mark_all_notifications_read_service() {
    const res = await axios.patch('/api/notifications/read-all');
    return res.data;
}

export async function delete_notification_service(id) {
    const res = await axios.delete(`/api/notifications/${id}`);
    return res.data;
}
