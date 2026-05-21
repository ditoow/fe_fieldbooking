"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialBookings = [
  {
    id: '#UGO-2940',
    initials: 'BS',
    name: 'Bagus Setiawan',
    colorClass: 'bg-blue-100 text-blue-700',
    lapangan: 'Lapangan Futsal A',
    tanggal: '24 Okt 2023',
    jam: '16:00-18:00',
    status: 'Menunggu',
  },
  {
    id: '#UGO-2938',
    initials: 'SA',
    name: 'Siti Aminah',
    colorClass: 'bg-pink-100 text-pink-700',
    lapangan: 'Gedung Badminton',
    tanggal: '24 Okt 2023',
    jam: '19:00-21:00',
    status: 'Disetujui',
  },
  {
    id: '#UGO-2937',
    initials: 'RA',
    name: 'Rudi Akbar',
    colorClass: 'bg-green-100 text-green-700',
    lapangan: 'Lapangan Basket Pro',
    tanggal: '23 Okt 2023',
    jam: '10:00-12:00',
    status: 'Ditolak',
  },
  {
    id: '#UGO-2936',
    initials: 'DW',
    name: 'Dinda Wulandari',
    colorClass: 'bg-purple-100 text-purple-700',
    lapangan: 'Lapangan Futsal A',
    tanggal: '23 Okt 2023',
    jam: '14:00-16:00',
    status: 'Menunggu',
  },
  {
    id: '#UGO-2935',
    initials: 'AB',
    name: 'Andi Budiman',
    colorClass: 'bg-yellow-100 text-yellow-700',
    lapangan: 'Lapangan Tenis 1',
    tanggal: '22 Okt 2023',
    jam: '08:00-10:00',
    status: 'Disetujui',
  }
];

export function RecentBookingsTable() {
  const [recentBookings, setRecentBookings] = useState(initialBookings);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    menunggu: true,
    disetujui: true,
    ditolak: true
  });
  const [pendingFilters, setPendingFilters] = useState({
    menunggu: true,
    disetujui: true,
    ditolak: true
  });

  // Ambil data transaksi dari localStorage "booking_history" 
  // (hasil dari halaman /pembayaran & /invoice) agar masuk ke tabel admin

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const historyStr = localStorage.getItem('booking_history');
      if (historyStr) {
        try {
          const historyArr = JSON.parse(historyStr);
          const mappedHistory = historyArr.map((b: any, index: number) => {
            // Pemetaan status dari frontend user ke admin
            let status = 'Menunggu';
            if (b.status === 'TERTUNDA' || b.status === 'DIPROSES') status = 'Menunggu';
            if (b.status === 'DISETUJUI' || b.status === 'BERHASIL') status = 'Disetujui';
            if (b.status === 'DITOLAK') status = 'Ditolak';

            // Generate inisial dummy (ambil user dari session jika ada)
            const sessionStr = localStorage.getItem("user_session");
            let name = "Nuralif Maulana";
            let initials = "NM";
            if (sessionStr) {
              const session = JSON.parse(sessionStr);
              name = session.nama || name;
              const parts = name.split(" ");
              initials = (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
            }

            // Warna acak
            const colors = [
              'bg-blue-100 text-blue-700', 'bg-pink-100 text-pink-700', 
              'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-yellow-100 text-yellow-700'
            ];
            
            return {
              id: `#${b.id}`,
              initials: initials,
              name: name,
              colorClass: colors[index % colors.length],
              lapangan: b.title,
              tanggal: b.date.substring(0, 11), // misal: "Senin, 11 Nov"
              jam: b.time,
              status: status,
            };
          });

          // Gabungkan data baru dengan data dummy lama
          setRecentBookings([...mappedHistory, ...initialBookings]);
        } catch (e) {
          console.error("Failed to parse booking_history", e);
        }
      }
    }
  }, []);

  const filteredBookings = useMemo(() => {
    return recentBookings.filter(booking => {
      const matchesSearch = booking.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            booking.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const noFilterSelected = !activeFilters.menunggu && !activeFilters.disetujui && !activeFilters.ditolak;
      let matchesStatus = noFilterSelected;
      
      if (!noFilterSelected) {
        if (activeFilters.menunggu && booking.status === 'Menunggu') matchesStatus = true;
        if (activeFilters.disetujui && booking.status === 'Disetujui') matchesStatus = true;
        if (activeFilters.ditolak && booking.status === 'Ditolak') matchesStatus = true;
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeFilters]);

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const currentBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border-b border-gray-100 pb-4 gap-4 sm:gap-0">
        <CardTitle className="font-bold text-lg text-ugo-sidebar m-0">Ringkasan Pemesanan Terbaru</CardTitle>
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Cari ID atau nama..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
          
          <Popover open={showFilter} onOpenChange={setShowFilter}>
            <PopoverTrigger asChild>
              <Button variant="default" className="bg-ugo-primary text-white hover:bg-ugo-primary/90 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-5 rounded-2xl shadow-xl" align="end">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filter</h3>
                <button onClick={() => {
                  setShowFilter(false);
                  setPendingFilters(activeFilters);
                }} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              
              <div className="mb-5">
                <p className="text-[10px] uppercase font-bold text-ugo-sidebar mb-3 tracking-wider">Status</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-menunggu" 
                      checked={pendingFilters.menunggu}
                      onCheckedChange={(checked) => setPendingFilters({...pendingFilters, menunggu: checked as boolean})}
                    />
                    <label htmlFor="filter-menunggu" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Menunggu
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-disetujui" 
                      checked={pendingFilters.disetujui}
                      onCheckedChange={(checked) => setPendingFilters({...pendingFilters, disetujui: checked as boolean})}
                    />
                    <label htmlFor="filter-disetujui" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Disetujui
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-ditolak" 
                      checked={pendingFilters.ditolak}
                      onCheckedChange={(checked) => setPendingFilters({...pendingFilters, ditolak: checked as boolean})}
                    />
                    <label htmlFor="filter-ditolak" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Ditolak
                    </label>
                  </div>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => {
                    const reset = {menunggu: true, disetujui: true, ditolak: true};
                    setPendingFilters(reset);
                    setActiveFilters(reset);
                    setCurrentPage(1);
                  }}
                  className="text-sm text-ugo-sidebar font-medium hover:text-ugo-primary hover:underline transition-colors"
                >
                  Atur Ulang
                </button>
                <Button 
                  onClick={() => {
                    setActiveFilters(pendingFilters);
                    setCurrentPage(1);
                    setShowFilter(false);
                  }}
                  className="bg-ugo-primary hover:bg-ugo-primary/90 text-white rounded-full text-sm font-bold"
                >
                  Terapkan Filter
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Booking ID</TableHead>
                <TableHead className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Nama User</TableHead>
                <TableHead className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Lapangan</TableHead>
                <TableHead className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Tanggal</TableHead>
                <TableHead className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Jam</TableHead>
                <TableHead className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Status</TableHead>
                <TableHead className="py-3 px-6 text-xs uppercase font-semibold text-gray-500 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <TableRow key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 border-none">
                    <TableCell className="py-4 px-6 font-semibold text-sm text-ugo-sidebar border-b border-gray-50">{booking.id}</TableCell>
                    <TableCell className="py-4 px-6 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${booking.colorClass} font-bold flex items-center justify-center text-xs shrink-0`}>{booking.initials}</div>
                        <span className="font-medium text-sm whitespace-nowrap">{booking.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm text-gray-600 border-b border-gray-50 whitespace-nowrap">{booking.lapangan}</TableCell>
                    <TableCell className="py-4 px-6 text-sm text-gray-600 border-b border-gray-50 whitespace-nowrap">{booking.tanggal}</TableCell>
                    <TableCell className="py-4 px-6 text-sm text-gray-600 border-b border-gray-50 whitespace-nowrap">{booking.jam}</TableCell>
                    <TableCell className="py-4 px-6 border-b border-gray-50 whitespace-nowrap">
                      {booking.status === 'Menunggu' && <span className="bg-ugo-status-menunggu-bg text-ugo-status-menunggu-text px-3 py-1 rounded-full text-xs font-bold inline-flex">Menunggu</span>}
                      {booking.status === 'Disetujui' && <span className="bg-ugo-status-disetujui-bg text-ugo-status-disetujui-text px-3 py-1 rounded-full text-xs font-bold inline-flex">Disetujui</span>}
                      {booking.status === 'Ditolak' && <span className="bg-ugo-status-ditolak-bg text-ugo-status-ditolak-text px-3 py-1 rounded-full text-xs font-bold inline-flex">Ditolak</span>}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center border-b border-gray-50">
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5 inline-block" /></button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500 font-medium">Tidak ada data yang sesuai filter</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 text-sm text-gray-500">
          <p>Menampilkan {currentBookings.length} dari {filteredBookings.length} entri</p>
          <div className="flex gap-1 items-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  currentPage === page 
                    ? 'bg-ugo-sidebar text-white font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >{page}</button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >&gt;</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
