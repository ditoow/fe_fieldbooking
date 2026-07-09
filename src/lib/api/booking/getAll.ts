import api from '../../api';
import type { BookingDetail } from './getOne';

export async function getAllBookings(): Promise<BookingDetail[]> {
    const res = await api.get('/bookings');
    return res.data.data;
}