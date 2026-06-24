import api from '@/lib/api';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    booking_id: number | null;
    read_at: string | null;
    created_at: string;
    time_ago: string;
}

export const getNotifications = async (): Promise<AppNotification[]> => {
    try {
        const response = await api.get('/admin/bookings?status=pending&booking_type=paid&per_page=10');
        const bookings = response.data.data || response.data;
        
        return bookings.map((b: any) => ({
            id: `booking-${b.id}`,
            title: 'Booking User Umum',
            message: `${b.user?.name || 'Seseorang'} sedang melakukan booking ${b.field_name}.`,
            type: 'info',
            booking_id: b.id,
            read_at: null, // Always unread to keep their attention while pending
            created_at: b.created_at,
            time_ago: b.formatted_date + ' ' + b.formatted_time
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getUserNotifications = async (): Promise<AppNotification[]> => {
    try {
        const response = await api.get('/notifications');
        return response.data.data || response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const markAsRead = async (id: string) => {
    return true;
};

export const markUserAsRead = async (id: string) => {
    try {
        await api.patch(`/notifications/${id}/read`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const markAllAsRead = async () => {
    return true;
};

export const markAllUserAsRead = async () => {
    try {
        await api.patch(`/notifications/read-all`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};