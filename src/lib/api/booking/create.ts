import api from '../../api';

export async function createBooking(schedule_ids: number[]) {
    const res = await api.post('/bookings', { schedule_ids });
    return res.data; // { message, data: BookingResource }
}