import { query } from "@/lib/connectdb";


export async function GET(request) {
    try {
        // Kiểm tra kết nối cơ sở dữ liệu
        const result = await query('SELECT 1 AS TestConnection');
        if (result.recordset.length > 0) {
            return Response.json({ message: 'Database connection successful!' });
        } else {
            return Response.json({ error: 'Database connection failed!' }, { status: 500 });
        }
    } catch (err) {
        console.error('Database connection error: ', err);
        return Response.json({ error: 'Database connection failed!', details: err.message }, { status: 500 });
    }
}
