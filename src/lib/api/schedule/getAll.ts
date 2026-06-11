import api from '../../api';

export interface Slot {
    id?: number; // Opsional karena slot virtual tidak memiliki ID
    start_time: string;
    end_time: string;
    price: string | number;
    status: "available" | "booked" | "maintenance";
}

export interface ScheduleDay {
    date: string;
    slots: Slot[];
}

export async function getSchedules(
    field_id: number,
    start_date: string,
    end_date: string
): Promise<ScheduleDay[]> {
    const res = await api.get('/schedules', {
        params: { field_id, start_date, end_date }
    });
    return Array.isArray(res.data?.data) ? res.data.data : [];
}