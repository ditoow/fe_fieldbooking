import api from '../../api';

export interface SubmitRatingPayload {
  rating: number;
  review?: string;
}

export async function submitRating(bookingId: number, payload: SubmitRatingPayload) {
  const res = await api.post(`/bookings/${bookingId}/rating`, payload);
  return res.data;
}

export async function getFieldRatings(fieldId: number) {
  const res = await api.get(`/fields/${fieldId}/ratings`);
  return res.data;
}
