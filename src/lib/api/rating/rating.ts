import api from '../../api';

export interface SubmitRatingPayload {
  booking_id?: number;
  rating: number;
  review?: string;
}

export async function submitRating(bookingId: number, payload: SubmitRatingPayload) {
  const finalPayload = { ...payload, booking_id: bookingId };
  const res = await api.post(`/bookings/${bookingId}/rating`, finalPayload);
  return res.data;
}

export async function getFieldRatings(fieldId: number) {
  const res = await api.get(`/fields/${fieldId}/ratings`);
  return res.data;
}
