import { getAllStaffs } from '@/models/staffModel';
import { authenticateToken } from '@/middleware/auth'; // nếu cần bắt đăng nhập

export async function GET(request) {
    const authResult = await authenticateToken(request);
    if (authResult instanceof Response) return authResult;

    try {
        const staffs = await getAllStaffs();
        return Response.json(staffs);
    } catch (err) {
        console.error('Error fetching staffs:', err);
        return Response.json({ error: 'Server Error' }, { status: 500 });
    }
}
