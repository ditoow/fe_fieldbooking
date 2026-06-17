import api from '../../api';

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdatePasswordPayload {
  current_password:  string;
  new_password:      string;
  new_password_confirmation: string;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const res = await api.put('/user/profile', payload);
  return res.data; // { message, user }
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  const res = await api.put('/user/password', payload);
  return res.data; // { message }
}
