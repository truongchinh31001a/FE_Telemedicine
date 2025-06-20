import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DATABASE_USER2,
  host: process.env.DATABASE_HOST2,
  database: process.env.DATABASE_NAME2,
  password: process.env.DATABASE_PASSWORD2,
  port: parseInt(process.env.DATABASE_PORT2, 10), // nếu bạn có cổng riêng
  ssl: false // 👈 nếu bạn dùng SSL thì set = true hoặc cấu hình thêm
});

export async function query(text, params = []) {
  try {
    const res = await pool.query(text, params);
    return res; // res.rows là mảng kết quả
  } catch (err) {
    console.error('❌ PostgreSQL Query Error:', err);
    throw err;
  }
}
