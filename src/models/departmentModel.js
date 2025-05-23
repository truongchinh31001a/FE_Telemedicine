import { query } from "@/lib/connectdb";

export async function getAllDepartments() {
    const result = await query(`
    SELECT DepartmentID, DepartmentName
    FROM Department
  `);

    return result.recordset;
}
