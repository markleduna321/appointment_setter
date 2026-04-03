import axios from 'axios';

export async function get_advanced_report_service(params = {}) {
    const res = await axios.get('/api/reports/advanced', { params });
    return res.data;
}
