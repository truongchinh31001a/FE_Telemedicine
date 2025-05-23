import sql from 'mssql';

const config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  options: {
    encrypt: false, // nếu dùng local MSSQL
    trustServerCertificate: true,
  },
};

let pool;

async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
    } catch (err) {
      console.error('❌ SQL Connection Error:', err);
      throw err;
    }
  }
  return pool;
}

export default {
  query: async (query, params = {}) => {
    const conn = await getPool();
    const request = conn.request();

    // Đặt input cho query từ params object
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    try {
      const result = await request.query(query);
      return result;
    } catch (err) {
      console.error('❌ Query Error:', err);
      throw err;
    }
  }
};
