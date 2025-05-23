import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function authenticateToken(request, allowedRoles = []) {
  try {
    // 1. Ưu tiên lấy token từ Authorization header
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // 2. Nếu không có header, lấy từ Cookie access_token
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }

    // Nếu không tìm được token
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // 4. Nếu có yêu cầu role (allowedRoles)
    if (allowedRoles.length && !allowedRoles.includes(decoded.role_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Trả user info nếu cần
    return { user: decoded };

  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
