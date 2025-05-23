import {
    getAllSchedules,
    getSchedulesByUserID,
    createSchedule,
    deleteSchedule,
    checkScheduleConflict,
    getScheduleByID,
    updateSchedule
} from '@/models/scheduleModel';

import { authenticateToken } from '@/middleware/auth';

export async function GET(request) {
    const authResult = await authenticateToken(request);
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(request.url);
    const userID = searchParams.get('userID'); // đã đổi từ staffID -> userID

    try {
        const schedules = userID
            ? await getSchedulesByUserID(userID)
            : await getAllSchedules();

        return Response.json(schedules);
    } catch (err) {
        return Response.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    const authResult = await authenticateToken(request);
    if (authResult instanceof Response) return authResult;

    try {
        const data = await request.json();

        // Kiểm tra xung đột cho từng member
        for (const member of data.members || []) {
            const hasConflict = await checkScheduleConflict(
                member.userId,
                data.workDate,
                data.startTime,
                data.endTime
            );
            if (hasConflict) {
                return Response.json({
                    error: `User ${member.userId} has a time conflict`
                }, { status: 409 });
            }
        }

        await createSchedule(data);
        return Response.json({ message: 'Schedule created successfully' });
    } catch (err) {
        return Response.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function GET_BY_ID(_request, { params }) {
    const authResult = await authenticateToken(_request);
    if (authResult instanceof Response) return authResult;

    try {
        const schedule = await getScheduleByID(params.id);

        if (!schedule) {
            return Response.json({ error: 'Not found' }, { status: 404 });
        }
        return Response.json(schedule);
    } catch (err) {
        return Response.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const authResult = await authenticateToken(request);
    if (authResult instanceof Response) return authResult;

    try {
        const data = await request.json();
        await updateSchedule(params.id, data);
        return Response.json({ message: 'Schedule updated successfully' });
    } catch (err) {
        return Response.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function DELETE(_request, { params }) {
    const authResult = await authenticateToken(_request);
    if (authResult instanceof Response) return authResult;

    try {
        await deleteSchedule(params.id);
        return Response.json({ message: 'Schedule deleted successfully' });
    } catch (err) {
        return Response.json({ error: 'Server Error' }, { status: 500 });
    }
}
