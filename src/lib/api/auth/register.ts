import api from '../../api';

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export async function register(payload: RegisterPayload) {
  const res = await api.post('/register', payload);
  return res.data;
}