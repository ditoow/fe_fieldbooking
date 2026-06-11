import api from '../../api';

export interface CreateBookingPayload {
    field_id: number;
    date: string; // Format: YYYY-MM-DD
    time_slots: string[]; // Contoh: ["08:00", "09:00"]
}

export async function createBooking(payload: CreateBookingPayload) {
    const res = await api.post('/bookings', payload);
    return res.data; // Mengembalikan { message, data: BookingResource }
}