import api from '../../api';
import Cookies from 'js-cookie';

interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const res = await api.post('/login', payload);
  // Simpan token JWT setelah login berhasil
  localStorage.setItem('jwt_token', res.data.token);
  
  Cookies.set('jwt_token', res.data.token, { expires: 1, sameSite: 'strict' });
  const userRole = res.data.user?.roles?.[0]?.name || res.data.user?.role;
  Cookies.set('user_role', userRole ? userRole.toLowerCase() : '', { expires: 1, sameSite: 'strict' });
  
  return res.data; // { token, user }
}