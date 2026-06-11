import axios from 'axios';
import api from '../../api';

const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('jwt_token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Create a new field
export const createField = async (data: FormData) => {
    const response = await axios.post(`${API_URL}/admin/fields`, data, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Update an existing field
export const updateField = async (id: number, data: FormData) => {
    // Note: Laravel requires POST with _method=PATCH for form-data to work properly
    data.append('_method', 'PATCH');
    const response = await axios.post(`${API_URL}/admin/fields/${id}`, data, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Delete a field
export const deleteField = async (id: number) => {
    const response = await api.delete(`/admin/fields/${id}`);
    return response.data;
};
