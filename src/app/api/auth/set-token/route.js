import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { token } = await req.json();

  try {
    const decodedToken = jwtDecode(token);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (decodedToken.patientId !== null) {
      return NextResponse.json({ error: 'Token is not valid for this operation' }, { status: 403 });
    }

    const url = new URL(req.url);
    const isSecure = url.protocol === 'https:';

    const res = NextResponse.json({ success: true });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? 'None' : 'Lax',
      path: '/',
      maxAge: 60 * 60,
    });

    console.log('✅ Token set with secure =', isSecure);
    return res;
  } catch (error) {
    console.error('❌ Error validating token:', error);
    return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
  }
}
