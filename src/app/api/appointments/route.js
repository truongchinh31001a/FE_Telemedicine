import * as appointmentController from '@/controllers/appointmentController';
import { withCors } from '@/lib/cors';

export const GET = withCors(appointmentController.GET);
export const POST = withCors(appointmentController.POST);
export const OPTIONS = withCors(() => new Response(null, { status: 204 }));
