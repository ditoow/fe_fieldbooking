import api from '../../api';

export async function cancelBookingApi(bookingId: string) {
    try {
        // Tinggal panggil api.patch, token 'jwt_token' otomatis disisipkan oleh api.ts!
        const res = await api.patch(`/bookings/${bookingId}/cancel`);
        return res.data;
    } catch (error: any) {
        // Lempar pesan error dari backend ke frontend agar bisa ditangkap oleh handleCancelBooking
        throw new Error(
            error.response?.data?.message || 'Gagal membatalkan pesanan di server'
        );
    }
}