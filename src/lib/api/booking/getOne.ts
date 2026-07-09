import api from '../../api';

export interface BookingDetail {
    id: number;
    booking_number: string;
    status: string;
    booking_type: string;
    total_price: number;
    file_url: string | null;
    qr_id?: string | null;
    qr_string?: string | null;
    is_attended: boolean;
    attended_at: string | null;
    expires_at: string | null;
    field_name: string;
    formatted_date: string;
    formatted_time: string;
    schedules: {
        id: number;
        field_id: number;
        date: string;
        start_time: string;
        end_time: string;
        price: number;
        status: string;
    }[];
    user: object;
    created_at: string;
}

export async function getBookingById(id: number): Promise<BookingDetail> {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
}