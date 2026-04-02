import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.Pusher = Pusher;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Required so axios sends the XSRF-TOKEN cookie as the X-XSRF-TOKEN header
// which Laravel's VerifyCsrfToken middleware reads for API routes using web middleware.
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

// Laravel Echo — real-time Pusher connection.
// Uses an axios-based authorizer so the live CSRF cookie is always included.
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    forceTLS: true,
    authorizer: (channel) => ({
        authorize: (socketId, callback) => {
            window.axios.post('/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name,
            })
                .then((response) => callback(false, response.data))
                .catch((error) => callback(true, error));
        },
    }),
});
