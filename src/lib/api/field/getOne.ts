import api from '../../api';
import { Field } from './getAll';

export async function getFieldById(id: number): Promise<Field> {
    const res = await api.get(`/fields/${id}`);
    return res.data.data;
}