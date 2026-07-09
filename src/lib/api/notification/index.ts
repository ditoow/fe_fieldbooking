import api from '@/lib/api';

export interface NotificationData {
    title: string;
    message: string;
    type: "info" | "success" | "warning";
    booking_id: number | null;
}

export interface AppNotification {
    id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

export const getNotifications = async (): Promise<AppNotification[]> => {
    const response = await api.get('/notifications');
    return response.data.data || response.data;
};
export const markAsRead = async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

// Menandai SEMUA notifikasi user menjadi "sudah dibaca"
export const markAllAsRead = async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
};