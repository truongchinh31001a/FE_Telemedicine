import { query } from "@/lib/connectdb";
import { NextResponse } from 'next/server'; // 👈 dùng đúng object của Next.js App Router

export async function GET(request) {
  try {
    const result = await query('SELECT 1 AS "TestConnection"');
    
    if (result.rows.length > 0) {
      return NextResponse.json({ message: 'Database connection successful!' });
    } else {
      return NextResponse.json({ error: 'Database connection failed!' }, { status: 500 });
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
    return NextResponse.json(
      { error: 'Database connection failed!', details: err.message },
      { status: 500 }
    );
  }
}
