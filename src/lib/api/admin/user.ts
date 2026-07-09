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

export const getAllUsers = async (search?: string, role?: string, status?: string): Promise<User[]> => {
    const params: Record<string, string> = { per_page: '100' };
    if (search) params.search = search;
    if (role) params.role = role;
    if (status) params.status = status;

    const response = await api.get('/admin/users', { params });
    return response.data.data;
};

export const updateUserStatus = async (id: string, status: 'active' | 'suspended'): Promise<void> => {
    await api.patch(`/admin/users/${id}/status`, { status });
};
