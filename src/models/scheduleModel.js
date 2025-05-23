import { query } from '@/lib/connectdb';
import db from '@/lib/db';

// Lấy tất cả các lịch kèm danh sách thành viên
export async function getAllSchedules() {
    const result = await query(`
        SELECT 
            s.ScheduleID,
            s.EventName,
            s.EventType,
            s.Room,
            s.StartTime,
            s.EndTime,
            s.WorkDate,
            s.Note,
            d.DepartmentName,
            u.UserID,
            ui.FullName,
            r.RoleName
        FROM Schedule s
        JOIN Department d ON s.DepartmentID = d.DepartmentID
        LEFT JOIN ScheduleMembers sm ON s.ScheduleID = sm.ScheduleID
        LEFT JOIN Staff st ON sm.StaffID = st.StaffID
        LEFT JOIN [User] u ON st.UserID = u.UserID
        LEFT JOIN UserInfo ui ON u.UserInfoID = ui.UserInfoID
        LEFT JOIN Roles r ON st.RoleID = r.RoleID
    `);

    const schedulesMap = new Map();
    for (const row of result.recordset) {
        if (!schedulesMap.has(row.ScheduleID)) {
            schedulesMap.set(row.ScheduleID, {
                scheduleId: row.ScheduleID,
                eventName: row.EventName,
                eventType: row.EventType,
                room: row.Room,
                startTime: row.StartTime,
                endTime: row.EndTime,
                workDate: row.WorkDate,
                note: row.Note,
                departmentName: row.DepartmentName,
                members: []
            });
        }
        if (row.UserID) {
            schedulesMap.get(row.ScheduleID).members.push({
                userId: row.UserID,
                fullName: row.FullName,
                role: row.RoleName
            });
        }
    }

    return Array.from(schedulesMap.values());
}

// Lấy lịch theo UserID
export async function getSchedulesByUserID(userID) {
    const result = await db.query(`
        SELECT 
            s.ScheduleID,
            s.EventName,
            s.EventType,
            s.Room,
            s.StartTime,
            s.EndTime,
            s.WorkDate,
            s.Note,
            d.DepartmentName,
            u.UserID,
            ui.FullName,
            r.RoleName
        FROM Schedule s
        JOIN Department d ON s.DepartmentID = d.DepartmentID
        JOIN ScheduleMembers sm ON s.ScheduleID = sm.ScheduleID
        JOIN Staff st ON sm.StaffID = st.StaffID
        JOIN [User] u ON st.UserID = u.UserID
        JOIN UserInfo ui ON u.UserInfoID = ui.UserInfoID
        JOIN Roles r ON st.RoleID = r.RoleID
        WHERE u.UserID = @userID
    `, { userID });

    const schedulesMap = new Map();
    for (const row of result.recordset) {
        if (!schedulesMap.has(row.ScheduleID)) {
            schedulesMap.set(row.ScheduleID, {
                scheduleId: row.ScheduleID,
                eventName: row.EventName,
                eventType: row.EventType,
                room: row.Room,
                startTime: row.StartTime,
                endTime: row.EndTime,
                workDate: row.WorkDate,
                note: row.Note,
                departmentName: row.DepartmentName,
                members: []
            });
        }
        schedulesMap.get(row.ScheduleID).members.push({
            userId: row.UserID,
            fullName: row.FullName,
            role: row.RoleName
        });
    }

    return Array.from(schedulesMap.values());
}

// Tạo lịch mới
export async function createSchedule(data) {
    const {
        departmentId,
        eventName,
        eventType,
        room,
        startTime,
        endTime,
        workDate,
        note,
        members
    } = data;

    try {
        // Đầu tiên tạo lịch trong bảng Schedule
        const result = await db.query(`
        INSERT INTO Schedule (DepartmentID, EventName, EventType, Room, StartTime, EndTime, WorkDate, Note)
        OUTPUT INSERTED.ScheduleID
        VALUES (@departmentId, @eventName, @eventType, @room, @startTime, @endTime, @workDate, @note)
      `, {
            departmentId,
            eventName,
            eventType,
            room,
            startTime,
            endTime,
            workDate,
            note
        });

        const scheduleId = result.recordset[0].ScheduleID;

        // Nếu có members, thực hiện thêm vào bảng ScheduleMembers
        if (Array.isArray(members) && members.length > 0) {
            console.log('Adding members to ScheduleID:', scheduleId);

            for (const member of members) {
                // Kiểm tra và ép kiểu staffId thành số nguyên
                const staffId = parseInt(member.value, 10);  // Giả sử member.value là ID của nhân viên
                if (isNaN(staffId)) {
                    throw new Error(`Invalid staffId: ${member.value}`);
                }

                console.log('Inserting member with StaffID:', staffId);

                await db.query(`
            INSERT INTO ScheduleMembers (ScheduleID, StaffID)
            VALUES (@scheduleId, @staffId)
          `, {
                    scheduleId,
                    staffId
                });

                console.log(`Added member with StaffID: ${staffId} to ScheduleID: ${scheduleId}`);
            }
        } else {
            console.log('No members to add for ScheduleID:', scheduleId);
        }

        return scheduleId;

    } catch (error) {
        console.error('Error in creating schedule:', error);
        throw new Error('Error while creating schedule');
    }
}

// Xóa lịch
export async function deleteSchedule(scheduleID) {
    const result = await db.query('DELETE FROM Schedule WHERE ScheduleID = @scheduleID', { scheduleID });
    return result.rowsAffected > 0;
}

// Kiểm tra xung đột lịch (dựa theo user)
export async function checkScheduleConflict(userID, workDate, startTime, endTime) {
    const result = await db.query(`
        SELECT * FROM Schedule s
        JOIN ScheduleMembers sm ON s.ScheduleID = sm.ScheduleID
        JOIN Staff st ON sm.StaffID = st.StaffID
        WHERE st.UserID = @userID
          AND s.WorkDate = @workDate
          AND (
            (s.StartTime < @endTime AND s.EndTime > @startTime)
          )
    `, { userID, workDate, startTime, endTime });
    return result.recordset.length > 0;
}

// Lấy lịch theo ID
export async function getScheduleByID(scheduleID) {
    const result = await db.query(`
        SELECT 
            s.ScheduleID,
            s.EventName,
            s.EventType,
            s.Room,
            s.StartTime,
            s.EndTime,
            s.WorkDate,
            s.Note,
            d.DepartmentName,
            u.UserID,
            ui.FullName,
            r.RoleName
        FROM Schedule s
        JOIN Department d ON s.DepartmentID = d.DepartmentID
        LEFT JOIN ScheduleMembers sm ON s.ScheduleID = sm.ScheduleID
        LEFT JOIN Staff st ON sm.StaffID = st.StaffID
        LEFT JOIN [User] u ON st.UserID = u.UserID
        LEFT JOIN UserInfo ui ON u.UserInfoID = ui.UserInfoID
        LEFT JOIN Roles r ON st.RoleID = r.RoleID
        WHERE s.ScheduleID = @scheduleID
    `, { scheduleID });

    if (result.recordset.length === 0) return null;

    const rows = result.recordset;
    const schedule = {
        scheduleId: rows[0].ScheduleID,
        eventName: rows[0].EventName,
        eventType: rows[0].EventType,
        room: rows[0].Room,
        departmentName: rows[0].DepartmentName,
        startTime: rows[0].StartTime,
        endTime: rows[0].EndTime,
        workDate: rows[0].WorkDate,
        note: rows[0].Note,
        members: rows.filter(row => row.UserID).map(row => ({
            userId: row.UserID,
            fullName: row.FullName,
            role: row.RoleName
        }))
    };

    return schedule;
}

// Cập nhật lịch
export async function updateSchedule(scheduleID, data) {
    const {
        eventName,
        eventType,
        room,
        startTime,
        endTime,
        workDate,
        note
    } = data;

    await db.query(`
        UPDATE Schedule
        SET EventName = @eventName,
            EventType = @eventType,
            Room = @room,
            StartTime = @startTime,
            EndTime = @endTime,
            WorkDate = @workDate,
            Note = @note
        WHERE ScheduleID = @scheduleID
    `, {
        scheduleID,
        eventName,
        eventType,
        room,
        startTime,
        endTime,
        workDate,
        note
    });
}
