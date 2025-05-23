import { query } from '@/lib/connectdb';

export async function getAllStaffs() {
  const result = await query(`
    SELECT 
      u.UserID,
      u.Username,
      u.Email,
      u.IsActive AS Status,
      u.Password,
      ui.FullName,
      ui.DateOfBirth,
      ui.Phone,
      ui.Address,
      ui.CCCD,
      ui.CCCDIssueDate,
      ui.CCCDIssuePlace,
      ui.Hometown,
      ui.Gender,
      ui.CCCDFront,
      ui.CCCDBack,
      ui.CCCDExpiredDate,
      ui.Ethnicity,
      ui.Nationality,
      ui.Image,
      s.Position AS Occupation
    FROM [User] AS u
    JOIN UserInfo AS ui ON u.UserInfoID = ui.UserInfoID
    JOIN Staff AS s ON u.UserID = s.UserID
    WHERE s.RoleID IN (2, 3)
  `);

  return result.recordset;
}
