import db from '@/lib/db';
import {
    getFullNameByStaffID,
    getFullNameByPatientID,
} from '@/models/userModel';
import {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} from '@/models/appointmentModel';

export async function GET(req, { params }) {
    if (params?.id) {
        const result = await getAppointmentById(params.id);
        return Response.json(result.recordset[0] || {}, { status: 200 });
    }
    const result = await getAllAppointments();
    return Response.json(result.recordset, { status: 200 });
}

export async function POST(req) {
    const body = await req.json();
    const result = await createAppointment(body);

    if (!result.success) {
        return Response.json({ error: result.message }, { status: 409 }); // 409 Conflict
    }

    return Response.json({ message: result.message }, { status: 201 });
}

export async function PUT(req, { params }) {
    const body = await req.json();
    const result = await updateAppointment(params.id, body);

    if (!result.success) {
        return Response.json({ error: result.message }, { status: 400 }); // 400 Bad Request
    }

    return Response.json({ message: result.message }, { status: 200 });
}


export async function DELETE(req, { params }) {
    await deleteAppointment(params.id);
    return Response.json({ message: 'Appointment deleted successfully' }, { status: 200 });
}

export async function getAppointmentParticipantsWithLinks(appointmentId) {
    const result = await db.query(
        `SELECT StaffID, PatientID, Room FROM Appointment WHERE AppointmentID = @appointmentId`,
        { appointmentId }
    );

    if (!result.recordset?.[0]) {
        throw new Error('Appointment not found');
    }

    const { StaffID, PatientID, Room } = result.recordset[0];

    const staffName = await getFullNameByStaffID(StaffID);
    const patientName = await getFullNameByPatientID(PatientID);

    return {
        staffName,
        staffCallLink: `http://192.168.1.199:3000/room?room=${Room}&name=${encodeURIComponent(staffName)}`,
        patientName,
        patientCallLink: `http://192.168.1.199:3000/room?room=${Room}&name=${encodeURIComponent(patientName)}`
    };
}
