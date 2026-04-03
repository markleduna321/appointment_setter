import axios from 'axios';

export async function get_patient_records_service(patientId) {
    const res = await axios.get(`/api/patients/${patientId}/records`);
    return res.data.data ?? res.data;
}

export async function get_latest_patient_record_service(patientId) {
    const res = await axios.get(`/api/patients/${patientId}/records/latest`);
    return res.data.data ?? null;
}

export async function get_patient_record_service(patientId, recordId) {
    const res = await axios.get(`/api/patients/${patientId}/records/${recordId}`);
    return res.data.data ?? res.data;
}

export async function create_patient_record_service(patientId, data) {
    const res = await axios.post(`/api/patients/${patientId}/records`, data);
    return res.data.data ?? res.data;
}

export async function update_patient_record_service(patientId, recordId, data) {
    const res = await axios.put(`/api/patients/${patientId}/records/${recordId}`, data);
    return res.data.data ?? res.data;
}

export async function delete_patient_record_service(patientId, recordId) {
    const res = await axios.delete(`/api/patients/${patientId}/records/${recordId}`);
    return res.data;
}
