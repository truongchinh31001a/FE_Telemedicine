import { getAllDepartments } from '@/models/departmentModel';
import { authenticateToken } from '@/middleware/auth';

export async function GET(request) {
    const authResult = await authenticateToken(request);
    if (authResult instanceof Response) return authResult;

    try {
        const departments = await getAllDepartments();
        return Response.json(departments);
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Server Error' }, { status: 500 });
    }
}
