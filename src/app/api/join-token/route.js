// app/api/join-token/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_2 || 'your-secret-key';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room');
  const name = searchParams.get('name');
  const patientId = searchParams.get('patientId');
  const recordId = searchParams.get('recordId');
  const appointmentId = searchParams.get('appointmentId');

  if (!room || !name) {
    return NextResponse.json({ error: 'Missing room or name' }, { status: 400 });
  }

  const token = jwt.sign(
    { room, name, patientId, recordId, appointmentId },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

  return NextResponse.json({ token });
}
