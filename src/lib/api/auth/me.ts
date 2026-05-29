import api from '../../api';

export async function getMe() {
  const res = await api.get('/me');
  return res.data; // return data user yang sedang login
}