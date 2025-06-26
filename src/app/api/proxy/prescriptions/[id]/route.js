import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req, context) {
  const recordId = await context.params.recordId;
  const body = await req.json();
  const token = cookies().get('token')?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions/${recordId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify([body]) // gửi trong mảng
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('❌ Lỗi proxy POST /prescriptions:', err);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
