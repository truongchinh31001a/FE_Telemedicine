import sql from 'mssql';

const config = {
    user: process.env.DATABASE_USER2,
    password: process.env.DATABASE_PASSWORD2,
    server: process.env.DATABASE_HOST2,
    port: parseInt(process.env.DATABASE_PORT2, 10), // 👈 thêm dòng này
    database: process.env.DATABASE_NAME2,
    options: {
        encrypt: false,
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

export async function query(sqlQuery, params = {}) {
    const conn = await getPool();
    const request = conn.request();

    Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
    });

    try {
        const result = await request.query(sqlQuery);
        return result;
    } catch (err) {
        console.error('❌ Query Error:', err);
        throw err;
    }
}
