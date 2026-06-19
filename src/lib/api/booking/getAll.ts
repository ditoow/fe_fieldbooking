import api from '../../api';
import type { BookingDetail } from './getOne';

export async function getAllBookings(params?: { per_page?: number }): Promise<BookingDetail[]> {
    const res = await api.get('/bookings', { params });
    return res.data.data;
}