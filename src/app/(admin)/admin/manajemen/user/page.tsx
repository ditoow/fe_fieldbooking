"use client";

import { Search, Filter, Loader2, Eye } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { getAllUsers, User } from '@/lib/api/admin/user';
import { useRouter } from 'next/navigation';

export default function ManajemenUserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ active: true, suspended: true });
  const [pendingFilters, setPendingFilters] = useState({ active: true, suspended: true });
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'mahasiswa' | 'umum'>('all');
  const [pendingRoleFilter, setPendingRoleFilter] = useState<'all' | 'admin' | 'mahasiswa' | 'umum'>('all');

  const fetchUsers = async () => {
    try { setIsLoading(true); const data = await getAllUsers(); setUsers(data); }
    catch (error) { console.error("Failed to fetch users", error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const getKategori = (u: User) => {
    if (u.roles?.some(r => r.name === 'admin')) return 'ADMIN';
    if (u.roles?.some(r => r.name === 'mahasiswa')) return 'MAHASISWA';
    return 'UMUM';
  };

  const getKategoriBadge = (k: string) => {
    if (k === 'ADMIN') return 'bg-purple-100 text-purple-800';
    if (k === 'MAHASISWA') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-700';
  };

  const filteredUsers = useMemo(() => users.filter(v => {
    const q = searchQuery.toLowerCase();
    const ms = v.name.toLowerCase().includes(q) || (v.user_number || '').toLowerCase().includes(q) || v.email.toLowerCase().includes(q);
    const ns = !activeFilters.active && !activeFilters.suspended;
    let ms2 = ns;
    if (!ns) { if (activeFilters.active && v.status === 'active') ms2 = true; if (activeFilters.suspended && v.status === 'suspended') ms2 = true; }
    return ms && ms2;
  }), [users, searchQuery, activeFilters]);

  const roleFilteredUsers = useMemo(() => {
    if (roleFilter === 'all') return filteredUsers;
    return filteredUsers.filter(u => getKategori(u) === roleFilter.toUpperCase());
  }, [filteredUsers, roleFilter]);

  const totalActive = users.filter(u => u.status === 'active').length;
  const totalSuspended = users.filter(u => u.status === 'suspended').length;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-6 fade-in animate-in">
        <div><h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Manajemen User</h1>
          <p className="text-gray-500 text-sm">Daftar semua pengguna — klik baris untuk melihat detail.</p></div>

        <div className="bg-ugo-sidebar rounded-2xl p-6 text-white flex justify-between items-end shadow-lg">
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold text-white tracking-wide">Statistik Pengguna</h2>
            <div className="flex items-center gap-8">
              <div><p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">TOTAL USER</p><p className="text-3xl font-bold text-white">{users.length}</p></div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div><p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">AKTIF</p><p className="text-3xl font-bold text-white">{totalActive}</p></div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div><p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">SUSPENDED</p><p className="text-3xl font-bold text-white">{totalSuspended}</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-t-2xl">
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">DATA PENGGUNA</p><h2 className="text-xl font-bold text-[#1C2B1E]">Daftar Pengguna</h2></div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Cari ID, nama, atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/20" />
              </div>
              <div className="relative">
                <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 px-4 py-2 bg-ugo-primary text-white rounded-lg text-sm font-medium hover:bg-ugo-primary/90 transition-colors"><Filter className="w-4 h-4" />Filters</button>
                {showFilter && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Filters</h3>
                      <button onClick={() => { setShowFilter(false); setPendingFilters(activeFilters); setPendingRoleFilter(roleFilter); }} className="text-gray-400 hover:text-gray-600">&times;</button>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kategori Pengguna</p>
                      <div className="flex flex-col gap-1">
                        {(['all', 'admin', 'mahasiswa', 'umum'] as const).map(r => (
                          <button key={r} onClick={() => setPendingRoleFilter(r)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pendingRoleFilter === r ? 'bg-ugo-primary/10 text-ugo-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {r === 'all' ? 'Semua Kategori' : r.charAt(0).toUpperCase() + r.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <hr className="my-4 border-gray-100" />
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</p>
                      <div className="flex flex-col gap-3">
                        {[{ key: 'active' as const, label: 'Aktif' }, { key: 'suspended' as const, label: 'Suspended' }].map(f => (
                          <label key={f.key} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={pendingFilters[f.key]} onChange={(e) => setPendingFilters({ ...pendingFilters, [f.key]: e.target.checked })} className="w-4 h-4 accent-ugo-primary rounded" />
                            <span className="text-sm font-medium">{f.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <hr className="my-4 border-gray-100" />
                    <div className="flex justify-between items-center">
                      <button onClick={() => { const reset = { active: true, suspended: true }; setPendingFilters(reset); setActiveFilters(reset); setRoleFilter('all'); setPendingRoleFilter('all'); }} className="text-sm text-ugo-sidebar font-medium hover:text-ugo-primary hover:underline transition-colors">Atur Ulang</button>
                      <button onClick={() => { setActiveFilters(pendingFilters); setRoleFilter(pendingRoleFilter); setShowFilter(false); }} className="px-5 py-2 bg-ugo-primary hover:bg-ugo-primary/90 text-white rounded-full text-sm font-bold transition-colors">Terapkan</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {isLoading ? <div className="flex justify-center items-center h-[300px]"><Loader2 className="w-8 h-8 animate-spin text-ugo-primary" /></div>
            : <table className="w-full text-left border-collapse">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">ID / NIM</th>
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Nama User</th>
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Kategori</th>
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Status</th>
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500 text-center">Aksi</th>
                </tr></thead>
                <tbody>{roleFilteredUsers.length > 0 ? roleFilteredUsers.map(v => {
                  const k = getKategori(v);
                  return <tr key={v.id} onClick={() => router.push(`/admin/manajemen/user/${v.id}`)} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="py-4 px-6 font-semibold text-sm text-ugo-sidebar whitespace-nowrap">{v.user_number || v.student_id || '-'}</td>
                    <td className="py-4 px-6"><div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-ugo-primary text-white font-bold flex items-center justify-center text-sm">{getInitials(v.name)}</div>
                      <div><p className="font-bold text-sm text-ugo-sidebar">{v.name}</p><p className="text-xs text-gray-500">{v.email}</p></div>
                    </div></td>
                    <td className="py-4 px-6"><span className={`${getKategoriBadge(k)} px-3 py-1 rounded-full text-xs font-bold inline-flex`}>{k}</span></td>
                    <td className="py-4 px-6">{v.status === 'active' ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex">Aktif</span> : <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold inline-flex uppercase">Suspended</span>}</td>
                    <td className="py-4 px-6 text-center"><button onClick={() => router.push(`/admin/manajemen/user/${v.id}`)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-ugo-primary text-white rounded-lg text-xs font-bold hover:bg-ugo-primary/90 transition-colors"><Eye className="w-3.5 h-3.5" />Lihat Detail</button></td>
                  </tr>;
                }) : <tr><td colSpan={5} className="py-12 text-center text-gray-500 font-medium">Tidak ada pengguna yang sesuai.</td></tr>}</tbody>
              </table>}
          </div>
        </div>
      </div>
    </div>
  );
}
