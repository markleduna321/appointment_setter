import axios from 'axios';

export async function get_appointments_summary_service(params = {}) {
    const res = await axios.get('/api/reports/appointments-summary', { params });
    return res.data;
}
