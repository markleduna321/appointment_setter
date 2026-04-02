import axios from 'axios';

export async function get_patients_service(params = {}) {
	const res = await axios.get('/api/patients', { params });
	return res.data.data ?? res.data;
}

export async function create_patient_service(data) {
	const res = await axios.post('/api/patients', data);
	return res.data.data ?? res.data;
}

export async function update_patient_service(id, data) {
	const res = await axios.put(`/api/patients/${id}`, data);
	return res.data.data ?? res.data;
}

export async function delete_patient_service(id) {
	const res = await axios.delete(`/api/patients/${id}`);
	return res.data;
}

