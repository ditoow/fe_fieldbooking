import api from "../../api";

export interface Schedule {
  id: number;
  field_id: string;
  date: string;
  start_time: string;
  end_time: string;
  price: string;
  status: string;
}

export interface Field {
  id: number;
  name: string;
  description: string;
  surface_type: string;
  rating: number;
  image_url: string;
  carousel_urls?: string[];
  category: string;
  status: string; // "available" / "maintenance"
  price_min: string | null;
  price_max: string | null;
  schedules: Schedule[];
  available_slots_today: number;
  specifications: { label: string; value: string }[];
}

export async function getAllFields(): Promise<Field[]> {
  const res = await api.get("/fields");
  // Sekarang BE wrap di 'data', bukan 'message' lagi!
  return Array.isArray(res.data?.data) ? res.data.data : [];
}
