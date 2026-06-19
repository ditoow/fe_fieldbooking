import api from '../../api';

export interface MaintenanceItem {
    id: number;
    field_id: number;
    date: string;
    start_time: string | null;
    end_time: string | null;
    reason: string;
    created_at: string;
    updated_at: string;
}

export const getMaintenances = async (fieldId: number): Promise<MaintenanceItem[]> => {
    const res = await api.get(`/admin/fields/${fieldId}/maintenances`);
    return res.data.data;
};

export const createMaintenance = async (fieldId: number, data: {
    date: string;
    start_time?: string;
    end_time?: string;
    reason: string;
}): Promise<MaintenanceItem> => {
    const res = await api.post(`/admin/fields/${fieldId}/maintenances`, data);
    return res.data.data;
};

export const deleteMaintenance = async (id: number): Promise<void> => {
    await api.delete(`/admin/maintenances/${id}`);
};
