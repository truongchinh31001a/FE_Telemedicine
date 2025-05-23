import { getUserInfoIDByUserID, getFullNameByUserInfoID } from '@/models/userModel';

export async function getUserFullName(id) {
    const userInfoID = await getUserInfoIDByUserID(id);
    if (!userInfoID) throw new Error('User not found');

    const fullName = await getFullNameByUserInfoID(userInfoID);
    if (!fullName) throw new Error('UserInfo not found');

    return fullName;
}

export async function getFullNameByStaffID(staffId) {
    const result = await db.staff.findUnique({
        where: { StaffID: Number(staffId) },
        include: {
            user: {
                include: {
                    userInfo: true
                }
            }
        }
    });
    return result?.user?.userInfo?.FullName || null;
}

export async function getFullNameByPatientID(patientId) {
    const result = await db.patient.findUnique({
        where: { PatientID: Number(patientId) },
        include: {
            user: {
                include: {
                    userInfo: true
                }
            }
        }
    });
    return result?.user?.userInfo?.FullName || null;
}
