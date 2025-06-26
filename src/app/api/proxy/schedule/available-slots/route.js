import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL4;

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get('departmentId');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  const url = new URL(`${API_URL}/appointment/available-slots`);
  
  if (departmentId) url.searchParams.set('departmentId', departmentId);
  if (fromDate) url.searchParams.set('fromDate', fromDate);
  if (toDate) url.searchParams.set('toDate', toDate);

  try {
    const res = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('❌ Error fetching available slots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
