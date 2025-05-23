import dayjs from "dayjs";
import { query } from "@/lib/connectdb"; 

export async function getAppointmentByRoom(room) {
  const res = await query(
    `SELECT AppointmentID, PatientID, StaffID FROM Appointment WHERE Room = @room`,
    { room }
  );
  return res.recordset?.[0];
}

export async function getStaffIDByUserID(userID) {
  const res = await query(
    `SELECT StaffID FROM Staff WHERE UserID = @userID`,
    { userID }
  );
  return res.recordset?.[0]?.StaffID;
}

export async function isAppointmentMember(appointmentID, staffID) {
  const res = await query(
    `SELECT 1 FROM AppointmentMembers WHERE AppointmentID = @appointmentID AND StaffID = @staffID`,
    { appointmentID, staffID }
  );
  return res.recordset.length > 0;
}

export async function getAllAppointments() {
  return await query(`
    SELECT 
      A.*, 
      StaffInfo.FullName AS StaffName,
      PatientInfo.FullName AS PatientName
    FROM Appointment A
    LEFT JOIN Staff S ON A.StaffID = S.StaffID
    LEFT JOIN [User] StaffUser ON S.UserID = StaffUser.UserID
    LEFT JOIN UserInfo StaffInfo ON StaffUser.UserInfoID = StaffInfo.UserInfoID
    LEFT JOIN Patient P ON A.PatientID = P.PatientID
    LEFT JOIN [User] PatientUser ON P.UserID = PatientUser.UserID
    LEFT JOIN UserInfo PatientInfo ON PatientUser.UserInfoID = PatientInfo.UserInfoID
  `);
}

export async function getAppointmentById(id) {
  return await query(`
    SELECT 
      A.*, 
      StaffInfo.FullName AS StaffName,
      PatientInfo.FullName AS PatientName
    FROM Appointment A
    LEFT JOIN Staff S ON A.StaffID = S.StaffID
    LEFT JOIN [User] StaffUser ON S.UserID = StaffUser.UserID
    LEFT JOIN UserInfo StaffInfo ON StaffUser.UserInfoID = StaffInfo.UserInfoID
    LEFT JOIN Patient P ON A.PatientID = P.PatientID
    LEFT JOIN [User] PatientUser ON P.UserID = PatientUser.UserID
    LEFT JOIN UserInfo PatientInfo ON PatientUser.UserInfoID = PatientInfo.UserInfoID
    WHERE A.AppointmentID = @id
  `, { id });
}

export async function createAppointment(data) {
  const {
    staffId,
    startTime,
    endTime,
    workDate,
    type,
    recordId,
    room,
    patientId,
    status,
    note
  } = data;

  const calculatedEndTime = endTime || dayjs(`2000-01-01T${startTime}`).add(30, 'minute').format('HH:mm:ss');

  // ✅ Nếu là khám online thì tự tạo Room = TELE + số ngẫu nhiên
  let finalRoom = room;
  const onlineTypes = ['khám trực tuyến', 'khám cấp cứu từ xa', 'tư vấn sức khoẻ', 'hội chẩn đa khoa'];

  if (!finalRoom && onlineTypes.includes(type.toLowerCase())) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // số ngẫu nhiên 4 chữ số
    finalRoom = `TELE${randomNumber}`;
  }

  // ✅ Bước 1: Check conflict
  const conflict = await query(
    `SELECT * FROM Appointment
     WHERE StaffID = @staffId
       AND WorkDate = @workDate
       AND (
            (StartTime <= @startTime AND EndTime > @startTime) OR
            (StartTime < @endTime AND EndTime >= @endTime) OR
            (StartTime >= @startTime AND EndTime <= @endTime)
         )`,
    { staffId, workDate, startTime, endTime: calculatedEndTime }
  );

  if (conflict.recordset.length > 0) {
    return {
      success: false,
      message: "Time slot already booked by another appointment."
    };
  }

  // ✅ Bước 2: Insert nếu không conflict
  await query(
    `INSERT INTO Appointment (StaffID, StartTime, EndTime, WorkDate, Type, RecordID, Room, PatientID, Status, Note)
     VALUES (@staffId, @startTime, @endTime, @workDate, @type, @recordId, @room, @patientId, @status, @note)`,
    { staffId, startTime, endTime: calculatedEndTime, workDate, type, recordId, room: finalRoom, patientId, status, note }
  );

  return {
    success: true,
    message: "Appointment created successfully"
  };
}

export async function updateAppointment(id, data) {
  const { status } = data;

  // ✅ Validate status
  const validStatuses = ['pending', 'confirmed', 'canceled'];

  if (!validStatuses.includes(status)) {
    return {
      success: false,
      message: "Invalid status value. Allowed values: pending, confirmed, canceled."
    };
  }

  // ✅ Update nếu status hợp lệ
  await query(
    `UPDATE Appointment 
     SET Status = @status
     WHERE AppointmentID = @id`,
    { id, status }
  );

  return {
    success: true,
    message: "Appointment status updated successfully."
  };
}


export async function deleteAppointment(id) {
  return await query(`DELETE FROM Appointment WHERE AppointmentID = @id`, { id });
}