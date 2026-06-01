import api from '../../api';

export interface Slot {
    id: number;
    start_time: string;
    end_time: string;
    price: string;
    status: string;   // "available" / "booked"
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