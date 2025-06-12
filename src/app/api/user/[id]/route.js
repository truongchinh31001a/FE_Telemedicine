import { NextResponse } from 'next/server';
import { getUserFullName } from '@/controllers/userController';

export async function GET(req, context) {
  const { id } = await context.params; 

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const fullName = await getUserFullName(id);
    return NextResponse.json({ fullName });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
