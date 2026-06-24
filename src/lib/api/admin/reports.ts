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
  
  if (status) {
    if (status === 'BERHASIL') params.status = 'SUCCESS';
    else if (status === 'MENUNGGU') params.status = 'PENDING';
    else if (status === 'GAGAL') params.status = 'FAILED';
    else if (status === 'BATAL') params.status = 'CANCELLED';
    else params.status = status;
  }

  const response = await api.get('/admin/reports/transactions', { params });
  const rawData = response.data.data || [];

  return rawData.map((item: any) => {
    let mappedStatus: 'BERHASIL' | 'MENUNGGU' | 'GAGAL' | 'BATAL' = 'MENUNGGU';
    if (item.status === 'SUCCESS') mappedStatus = 'BERHASIL';
    else if (item.status === 'PENDING') mappedStatus = 'MENUNGGU';
    else if (item.status === 'FAILED') mappedStatus = 'GAGAL';
    else if (item.status === 'CANCELLED') mappedStatus = 'BATAL';

    return {
      id: item.id,
      icon: item.icon,
      fasilitas: item.facility,
      pengguna: item.user,
      kategori: item.category,
      tanggal: item.date,
      waktu: item.time,
      durasi: item.duration ? item.duration.replace('hrs', 'Jam') : '',
      nominal: item.amount,
      nominal_numeric: item.amount_numeric,
      metodePembayaran: item.payment_method,
      status: mappedStatus,
    };
  });
};

export interface ExportPdfResponse {
  success: boolean;
  url: string;
}

// 2. Export PDF to Supabase and return URL
export const exportPdfReport = async (month: number, year: number): Promise<ExportPdfResponse> => {
  const response = await api.get('/admin/reports/pdf', {
    params: { month, year },
  });
  return response.data;
};

// 3. Get demographics data
export const getDemographicsReport = async (): Promise<DemographicResponse> => {
  const response = await api.get('/admin/reports/demographics');
  return response.data;
};

// 4. Get PDF compilation report data
export const getPdfReportData = async (): Promise<PdfReportData> => {
  const response = await api.get('/admin/reports/pdf-data');
  const rawData = response.data.data;

  return {
    report_id: rawData.report_id,
    print_date: rawData.print_date,
    summary: {
      total_revenue: rawData.summary.total_revenue,
      revenue_trend: rawData.summary.revenue_trend ? rawData.summary.revenue_trend.replace('Last Month', 'Bulan Sebelumnya') : '',
      total_bookings: rawData.summary.total_bookings,
      active_users: rawData.summary.active_users,
    },
    utilization: rawData.utilization || [],
    transactions: (rawData.transactions || []).map((trx: any) => ({
      id: trx.id,
      user_detail: trx.user_detail,
      layanan: trx.service,
      tanggal: trx.date,
      nominal: trx.amount,
      status: trx.status,
    })),
  };
};

// 4. Download PDF report directly
export const downloadPdfReport = async (): Promise<void> => {
  const response = await api.get('/admin/reports/pdf');
  
  if (response.data && response.data.url) {
    // Backend returns a JSON with the Supabase public URL
    const pdfUrl = response.data.url;
    
    // Open in a new tab (or you could create a link to force download)
    window.open(pdfUrl, '_blank');
  } else {
    throw new Error('Gagal mendapatkan URL PDF dari server');
  }
};
