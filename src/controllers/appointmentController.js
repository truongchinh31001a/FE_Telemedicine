import db from '@/lib/db';
import { verifyAuthToken } from '@/lib/auth';
import {
  getFullNameByStaffID,
  getFullNameByPatientID,
} from '@/models/userModel';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByStaffId,
} from '@/models/appointmentModel';

// Lấy tất cả hoặc theo query (patientId)
export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');

  try {
    const user = verifyAuthToken(req); // 🔐 xác thực người dùng

    // Lấy theo bệnh nhân (nếu có query)
    if (patientId) {
      // if (user.role !== 'admin' && user.patientId !== Number(patientId)) {
      //   return Response.json({ error: 'Unauthorized' }, { status: 403 });
      // }
      const result = await getAppointmentsByPatientId(patientId);
      return Response.json(result.recordset, { status: 200 });
    }

    // Lấy theo ID (nếu có param)
    if (params?.id) {
      const result = await getAppointmentById(params.id);
      return Response.json(result.recordset[0] || {}, { status: 200 });
    }

    // Nếu không truyền gì, trả về toàn bộ
    const result = await getAllAppointments();
    return Response.json(result.recordset, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Tạo lịch hẹn mới
export async function POST(req) {
  try {
    verifyAuthToken(req); // yêu cầu xác thực
    const body = await req.json();
    const result = await createAppointment(body);

    if (!result.success) {
      return Response.json({ error: result.message }, { status: 409 });
    }

    return Response.json({ message: result.message }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 401 });
  }
}

// Cập nhật trạng thái lịch hẹn
export async function PUT(req, { params }) {
  try {
    verifyAuthToken(req);
    const body = await req.json();
    const result = await updateAppointment(params.id, body);

    if (!result.success) {
      return Response.json({ error: result.message }, { status: 400 });
    }

    return Response.json({ message: result.message }, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 401 });
  }
}

// Xoá lịch hẹn
export async function DELETE(req, { params }) {
  try {
    verifyAuthToken(req);
    await deleteAppointment(params.id);
    return Response.json({ message: 'Appointment deleted successfully' }, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 401 });
  }
}

// Gọi trong cuộc hẹn — tạo link cho Staff và Patient
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

// Handler riêng: lấy lịch hẹn theo bệnh nhân (dùng cho route /appointments/patient/[id])
export async function getAppointmentsByPatientIdHandler(req, params) {
  try {
    const user = verifyAuthToken(req);
    const patientId = params.id;

    if (!patientId) {
      return Response.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    // if (user.role !== 'admin' && String(user.patientId) !== String(patientId)) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    const result = await getAppointmentsByPatientId(patientId);
    return Response.json(result.recordset, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 401 });
  }
}

// Handler riêng: lấy lịch hẹn theo bác sĩ (dùng cho route /appointments/staff/[id])
export async function getAppointmentsByStaffIdHandler(req, params) {
  try {
    const user = verifyAuthToken(req);
    const staffId = params.id;

    if (!staffId) {
      return Response.json({ error: 'Missing staff ID' }, { status: 400 });
    }

    // if (user.role !== 'admin' && String(user.staffId) !== String(staffId)) {
    //   return Response.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    const result = await getAppointmentsByStaffId(staffId);
    return Response.json(result.recordset, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 401 });
  }
}
