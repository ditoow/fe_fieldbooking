import api from '../../api';

export interface TransactionReportItem {
  id: string; // e.g. "#1001" or "#MYU-2938"
  icon: string; // e.g. "⚽"
  fasilitas: string; // e.g. "Lapangan Futsal A"
  pengguna: string; // e.g. "Ahmad Fauzi"
  kategori: 'PUBLIC' | 'STUDENT';
  tanggal: string; // e.g. "24 Okt, 2023"
  waktu: string; // e.g. "19:00 - 21:00"
  durasi: string; // e.g. "2 Jam"
  nominal: string; // e.g. "Rp 150.000"
  nominal_numeric: number; // e.g. 150000
  metodePembayaran: string; // e.g. "QRIS"
  status: 'BERHASIL' | 'MENUNGGU' | 'GAGAL' | 'BATAL';
}

export interface DemographicItem {
  name: string; // e.g. "Public" or "Student"
  value: number;
  color: string;
}

export interface DemographicResponse {
  success: boolean;
  total_users: number;
  data: DemographicItem[];
}

export interface PdfReportData {
  report_id: string; // e.g. "#UGO-RPT-202405"
  print_date: string; // e.g. "31 Mei 2024"
  summary: {
    total_revenue: number;
    revenue_trend: string; // e.g. "▲ 12.5% vs Bulan Sebelumnya"
    total_bookings: number;
    active_users: number;
  };
  utilization: Array<{
    field_name: string;
    rate: number; // e.g. 92 (percentage)
  }>;
  transactions: Array<{
    id: string;
    user_detail: string;
    layanan: string;
    tanggal: string;
    nominal: string;
    status: string;
  }>;
}

// 1. Get transactions report
export const getTransactionsReport = async (search?: string, status?: string): Promise<TransactionReportItem[]> => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (status) params.status = status;

  const response = await api.get('/admin/reports/transactions', { params });
  return response.data.data;
};

// 2. Get demographics data
export const getDemographicsReport = async (): Promise<DemographicResponse> => {
  const response = await api.get('/admin/reports/demographics');
  return response.data;
};

// 3. Get PDF compilation report data
export const getPdfReportData = async (): Promise<PdfReportData> => {
  const response = await api.get('/admin/reports/pdf-data');
  return response.data.data;
};
