import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    get_notifications_service,
    mark_notification_read_service,
    mark_all_notifications_read_service,
    delete_notification_service,
} from '../../services/notification-service';

export const fetchNotificationsThunk = createAsyncThunk(
    'notifications/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await get_notifications_service();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load notifications.');
        }
    }
);

export const markNotificationReadThunk = createAsyncThunk(
    'notifications/markRead',
    async (id, { rejectWithValue }) => {
        try {
            return await mark_notification_read_service(id);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to mark as read.');
        }
    }
);

export const markAllNotificationsReadThunk = createAsyncThunk(
    'notifications/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            return await mark_all_notifications_read_service();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to mark all as read.');
        }
    }
);

export const deleteNotificationThunk = createAsyncThunk(
    'notifications/delete',
    async (id, { rejectWithValue }) => {
        try {
            await delete_notification_service(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to delete notification.');
        }
    }
);
