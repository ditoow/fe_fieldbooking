import api from '../../api';

export async function logout() {
    try {
        // Coba hit BE dulu, kalau gagal (404/error) tidak apa-apa
        await api.post('/logout');
    } catch {
        // BE belum punya route logout — diabaikan
        // Token di sisi client tetap dihapus di bawah
    } finally {
        // Ini yang penting — bersihkan semua data auth dari browser
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_session');
    }
}