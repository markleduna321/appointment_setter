import axios from 'axios';

/**
 * POST /api/auth/login
 * Uses session-based auth (web middleware). Axios sends the XSRF-TOKEN cookie
 * automatically as the X-XSRF-TOKEN header.
 */
export async function login_service(credentials) {
    const res = await axios.post('/api/auth/login', credentials);
    return res.data;
}

/**
 * POST /api/auth/register
 */
export async function register_service(data) {
    const res = await axios.post('/api/auth/register', data);
    return res.data;
}

/**
 * POST /api/auth/logout
 */
export async function logout_service() {
    const res = await axios.post('/api/auth/logout');
    return res.data;
}
