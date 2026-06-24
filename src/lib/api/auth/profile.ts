import api from '../../api';

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdatePasswordPayload {
  current_password:  string;
  password:          string;
  password_confirmation: string;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  // Use POST with _method=PUT to bypass PHP 8.2 backend crash on PUT requests
  const res = await api.post('/user/profile', { ...payload, _method: 'PUT' });
  return res.data; // { message, user }
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  // Use POST with _method=PUT to bypass PHP 8.2 backend crash on PUT requests
  const res = await api.post('/user/password', { ...payload, _method: 'PUT' });
  return res.data; // { message }
}
