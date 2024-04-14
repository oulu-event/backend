const { Pool } = require('pg');

const openDb = () => {
    const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "event_manager",
        password: "292511",
        port: 5432
    });
    return pool;
}


const query = async (sql, values = []) => {
    console.log('calling query')
    return new Promise(async (resolve, reject) => {
        try {
            const pool = openDb();

            // Check if the 'user' table exists
            const checkTableExistsSql = `SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE  table_schema = 'public'
                AND    table_name   = 'user'
            );`;
            const tableExistsResult = await pool.query(checkTableExistsSql);
            const tableExists = tableExistsResult.rows[0].exists;

            // If the 'user' table doesn't exist, create it
            if (!tableExists) {
                const createTableSql = `
                    CREATE TABLE "user" (
                        id SERIAL PRIMARY KEY,
                        firstname VARCHAR(100),
                        lastname VARCHAR(100),
                        dob DATE,
                        email VARCHAR(100),
                        password VARCHAR(100)
                    );
                `;
                await pool.query(createTableSql);
            }

            // Execute the original query
            const result = await pool.query(sql, values);
            console.log('database connecting')
            console.log(result.rows)
            resolve(result);
        } catch (error) {
            console.log('got error in query')
            console.log(error.message)
            reject(error);
        }
    });
}

module.exports = {
    query
}