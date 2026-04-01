import axios from 'axios';

export async function get_dashboard_summary_service() {
    const res = await axios.get('/api/dashboard/summary');
    return res.data;
}
