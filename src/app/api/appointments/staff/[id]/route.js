import { getAppointmentsByStaffIdHandler } from '@/controllers/appointmentController';
export async function GET(req, context) {
    const { id } = await context.params;
    return getAppointmentsByStaffIdHandler(req, { id });
}