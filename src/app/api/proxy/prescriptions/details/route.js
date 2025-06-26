import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(req) {
  const token = cookies().get('token')?.value;
  const body = await req.json();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions/detail/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('❌ Lỗi proxy PUT /prescriptions/details:', err);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
