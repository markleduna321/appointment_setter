import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Required so axios sends the XSRF-TOKEN cookie as the X-XSRF-TOKEN header
// which Laravel's VerifyCsrfToken middleware reads for API routes using web middleware.
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;
