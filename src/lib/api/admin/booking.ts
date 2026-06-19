import api from '../../api';
import type { BookingDetail } from '../booking/getOne';

export async function getAdminBookings(params?: Record<string, string | number>): Promise<BookingDetail[]> {
    const res = await api.get('/admin/bookings', { params });
    return res.data.data;
}

export async function approveBooking(id: number): Promise<void> {
    await api.patch(`/admin/bookings/${id}/approve`);
}

export async function rejectBooking(id: number): Promise<void> {
    await api.patch(`/admin/bookings/${id}/reject`);
}

export async function attendBooking(id: number): Promise<void> {
    await api.patch(`/admin/bookings/${id}/attend`);
}
