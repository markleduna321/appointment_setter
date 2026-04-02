import { createSlice } from '@reduxjs/toolkit';
import {
    fetchNotificationsThunk,
    markNotificationReadThunk,
    markAllNotificationsReadThunk,
    deleteNotificationThunk,
} from './notification-thunk';

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        loading: false,
        error: null,
        // The notification currently open in the detail modal
        activeNotification: null,
    },
    reducers: {
        setActiveNotification(state, action) {
            state.activeNotification = action.payload;
        },
        clearActiveNotification(state) {
            state.activeNotification = null;
        },
        // Real-time: push an incoming notification to the top
        pushNotification(state, action) {
            // Avoid duplicates
            const exists = state.items.some((n) => n.id === action.payload.id);
            if (!exists) state.items.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotificationsThunk.pending,   (s) => { s.loading = true; s.error = null; })
            .addCase(fetchNotificationsThunk.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
            .addCase(fetchNotificationsThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

            .addCase(markNotificationReadThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((n) => n.id === a.payload.id);
                if (idx !== -1) s.items[idx] = { ...s.items[idx], is_read: true };
                if (s.activeNotification?.id === a.payload.id) {
                    s.activeNotification = { ...s.activeNotification, is_read: true };
                }
            })

            .addCase(markAllNotificationsReadThunk.fulfilled, (s) => {
                s.items = s.items.map((n) => ({ ...n, is_read: true }));
            })

            .addCase(deleteNotificationThunk.fulfilled, (s, a) => {
                s.items = s.items.filter((n) => n.id !== a.payload);
                if (s.activeNotification?.id === a.payload) s.activeNotification = null;
            });
    },
});

export const { setActiveNotification, clearActiveNotification, pushNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
