import { query } from "@/lib/connectdb"; // ✅ Dùng named import

export async function getUserInfoIDByUserID(userID) {
    const result = await query(
        'SELECT UserInfoID FROM [User] WHERE UserID = @userID',
        { userID }
    );
    return result.recordset?.[0]?.UserInfoID;
}

export async function getFullNameByUserInfoID(userInfoID) {
    const result = await query(
        'SELECT FullName FROM UserInfo WHERE UserInfoID = @userInfoID',
        { userInfoID }
    );
    return result.recordset?.[0]?.FullName;
}

export async function getFullNameByStaffID(staffID) {
    const result = await query(
        `
        SELECT UI.FullName
        FROM Staff S
        JOIN [User] U ON S.UserID = U.UserID
        JOIN UserInfo UI ON U.UserInfoID = UI.UserInfoID
        WHERE S.StaffID = @staffID
        `,
        { staffID }
    );
    return result.recordset?.[0]?.FullName || null;
}

export async function getFullNameByPatientID(patientID) {
    const result = await query(
        `
        SELECT UI.FullName
        FROM Patient P
        JOIN [User] U ON P.UserID = U.UserID
        JOIN UserInfo UI ON U.UserInfoID = UI.UserInfoID
        WHERE P.PatientID = @patientID
        `,
        { patientID }
    );
    return result.recordset?.[0]?.FullName || null;
}
