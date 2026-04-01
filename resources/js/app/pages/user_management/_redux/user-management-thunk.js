import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    get_staff_users_service,
    create_staff_user_service,
    delete_staff_user_service,
} from '../../../services/user-management-service';

export const fetchStaffUsersThunk = createAsyncThunk(
    'userManagement/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await get_staff_users_service();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load users.');
        }
    }
);

export const createStaffUserThunk = createAsyncThunk(
    'userManagement/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const user = await create_staff_user_service(data);
            dispatch(fetchStaffUsersThunk());
            return user;
        } catch (err) {
            // Surface Laravel validation errors as a single string
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to create user.');
        }
    }
);

export const deleteStaffUserThunk = createAsyncThunk(
    'userManagement/delete',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await delete_staff_user_service(id);
            dispatch(fetchStaffUsersThunk());
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to delete user.');
        }
    }
);
