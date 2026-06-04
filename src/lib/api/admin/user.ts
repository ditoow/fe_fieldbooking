import api from '../../api';

export interface Role {
    id: number;
    name: string;
    guard_name: string;
}

export interface User {
    id: string;
    user_number: string | null;
    name: string;
    email: string;
    phone: string | null;
    student_id: string | null;
    status: 'active' | 'suspended';
    roles: Role[];
    created_at: string;
    updated_at: string;
}

export const getAllUsers = async (): Promise<User[]> => {
    // We request pagination = 100 or simply get the default and map data
    const response = await api.get('/admin/users?per_page=100');
    return response.data.data;
};

export const updateUserStatus = async (id: string, status: 'active' | 'suspended'): Promise<void> => {
    await api.patch(`/admin/users/${id}/status`, { status });
};
