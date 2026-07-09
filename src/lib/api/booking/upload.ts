import api from '../../api';

export async function uploadBookingFile(bookingId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file); // field name sesuai BE

    const res = await api.post(`/bookings/${bookingId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}