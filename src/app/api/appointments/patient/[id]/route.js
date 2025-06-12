import { getAppointmentsByPatientIdHandler } from '@/controllers/appointmentController';
import { withCors } from '@/lib/cors';

export const GET = withCors(async (req, context) => {
  const { id } = await context.params;
  return getAppointmentsByPatientIdHandler(req, { id });
});

export const OPTIONS = withCors(() => new Response(null, { status: 204 }));
