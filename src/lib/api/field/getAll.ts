import api from '../../api';

export interface Field {
    id: number;
    nama_lapangan: string;
    deskripsi: string;
    kategori_lapangan: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export async function getAllFields(): Promise<Field[]> {
    const res = await api.get('/fields');
    // BE return { success: true, message: [...] }
    return Array.isArray(res.data?.message) ? res.data.message : [];
}