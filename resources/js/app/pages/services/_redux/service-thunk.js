import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    get_services_service,
    create_service_service,
    update_service_service,
    delete_service_service,
} from '../../../services/service-service';

export const fetchServicesThunk = createAsyncThunk(
    'services/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            return await get_services_service(params);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to load services.');
        }
    }
);

export const createServiceThunk = createAsyncThunk(
    'services/create',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const service = await create_service_service(data);
            dispatch(fetchServicesThunk());
            return service;
        } catch (err) {
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to create service.');
        }
    }
);

export const updateServiceThunk = createAsyncThunk(
    'services/update',
    async ({ id, data }, { rejectWithValue, dispatch }) => {
        try {
            const service = await update_service_service(id, data);
            dispatch(fetchServicesThunk());
            return service;
        } catch (err) {
            const laravelErrors = err.response?.data?.errors;
            if (laravelErrors) {
                const first = Object.values(laravelErrors)[0];
                return rejectWithValue(Array.isArray(first) ? first[0] : first);
            }
            return rejectWithValue(err.response?.data?.message ?? 'Failed to update service.');
        }
    }
);

export const deleteServiceThunk = createAsyncThunk(
    'services/delete',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await delete_service_service(id);
            dispatch(fetchServicesThunk());
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message ?? 'Failed to delete service.');
        }
    }
);
