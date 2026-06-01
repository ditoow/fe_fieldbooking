import api from '../../api';

interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const res = await api.post('/login', payload);
  // Simpan token JWT setelah login berhasil
  localStorage.setItem('jwt_token', res.data.token);
  return res.data; // { token, user }
}