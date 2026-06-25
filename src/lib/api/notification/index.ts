import api from '@/lib/api';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    booking_id: number | null;
    read_at: string | null;
    created_at: string;
    time_ago?: string;
    data?: any;
}

export const getNotifications = async (): Promise<AppNotification[]> => {
    try {
        const response = await api.get('/notifications');
        const data = response.data.data || response.data;
        
        return data.map((n: any) => ({
            id: n.id,
            title: n.data?.title || n.title || 'Notification',
            message: n.data?.message || n.message || '',
            type: n.data?.type || n.type || 'info',
            booking_id: n.data?.booking_id || n.booking_id || null,
            read_at: n.read_at,
            created_at: n.created_at,
            time_ago: n.time_ago || n.created_at,
            data: n.data
        }));
    } catch (e: any) {
        // console.error(e); // Diberi komentar agar tidak memunculkan overlay error di Next.js saat backend merespon 500
        console.warn("Failed to fetch notifications:", e.response?.data || e.message);
        return [];
    }
};

export const markAsRead = async (id: string) => {
    try {
        await api.patch(`/notifications/${id}/read`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const markAllAsRead = async () => {
    try {
        await api.patch(`/notifications/read-all`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};