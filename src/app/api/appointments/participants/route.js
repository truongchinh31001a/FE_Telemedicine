import { NextResponse } from 'next/server';
import { getAppointmentParticipantsWithLinks } from '@/controllers/appointmentController';

export async function GET(req) {
    const url = new URL(req.url);
    const appointmentId = url.searchParams.get('appointmentId');

    if (!appointmentId) {
        return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 });
    }

    try {
        const data = await getAppointmentParticipantsWithLinks(appointmentId);
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
