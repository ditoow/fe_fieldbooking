import api from '../../api';

export interface ReschedulePayload {
    field_id: number;
    date: string;
    new_time_slot: string;
}

export async function rescheduleBookingApi(bookingId: string | number, payload: ReschedulePayload) {
    try {
        const res = await api.patch(`/bookings/${bookingId}/reschedule`, payload);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Gagal mengubah jadwal pesanan'
        );
    }
}
