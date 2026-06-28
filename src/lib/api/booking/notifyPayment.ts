import api from '../../api';

export const notifyPayment = async (id: number) => {
    const response = await api.post(`/bookings/${id}/notify-payment`);
    return response.data;
};
