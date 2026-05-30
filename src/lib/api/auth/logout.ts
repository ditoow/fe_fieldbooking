import api from '../../api';

export async function logout() {
    await api.post('/logout');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_session');
}