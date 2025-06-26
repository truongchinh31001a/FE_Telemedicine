import { NextResponse } from 'next/server';

export async function GET(req) {
    const token = req.cookies.get('token')?.value;
    console.log('Token:', token);

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();
    return NextResponse.json(data);
}

export async function POST(req) {
    const token = req.cookies.get('token')?.value;
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}