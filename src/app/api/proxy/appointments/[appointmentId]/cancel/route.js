import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL4;

export async function PATCH(request, { params }) {
    const { appointmentId } = params;
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/appointment/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: {
            Authorization: token,
        },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
