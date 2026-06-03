import api from '../../api';

// Create a new field
export const createField = async (data: FormData) => {
    const response = await api.post('/admin/fields', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Update an existing field
export const updateField = async (id: number, data: FormData) => {
    // Note: Laravel requires POST with _method=PATCH for form-data to work properly
    data.append('_method', 'PATCH');
    const response = await api.post(`/admin/fields/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Delete a field
export const deleteField = async (id: number) => {
    const response = await api.delete(`/admin/fields/${id}`);
    return response.data;
};
