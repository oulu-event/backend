require('dotenv').config()
const { Pool } = require('pg');



const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// const query = async (sql, values = []) => {
//     console.log('calling query')
//     return new Promise(async (resolve, reject) => {
//         try {
//             const pool = openDb();

//             // Check if the 'user' table exists
//             const checkIfUserTableExists = `SELECT EXISTS (
//                 SELECT FROM information_schema.tables 
//                 WHERE  table_schema = 'public'
//                 AND    table_name   = 'user'
//             );`;
//             const userTableExistsResult = await pool.query(checkIfUserTableExists);
//             const userTableExists = userTableExistsResult.rows[0].exists;

//             // If the 'user' table doesn't exist, create it
//             if (!userTableExists) {
//                 const createTableSql = `
//                     CREATE TABLE "user" (
//                         id SERIAL PRIMARY KEY,
//                         firstname VARCHAR(100),
//                         lastname VARCHAR(100),
//                         dob DATE,
//                         email VARCHAR(100),
//                         password VARCHAR(100)
//                     );
//                 `;
//                 await pool.query(createTableSql);
//             }


            
//             // Check if the 'events' table exists
//             const checkIfEventTableExists = `SELECT EXISTS (
//                 SELECT FROM information_schema.tables 
//                 WHERE  table_schema = 'public'
//                 AND    table_name   = 'event'
//             );`;
//             const eventTableExistsResult = await pool.query(checkIfEventTableExists);
//             const eventTableExists = eventTableExistsResult.rows[0].exists;

//             // If the 'events' table doesn't exist, create it
//             if (!eventTableExists) {
//                 const createTableSql = `
//                     CREATE TABLE "event" (
//                         id SERIAL PRIMARY KEY,
//                         title VARCHAR(100),
//                         description VARCHAR(100),
//                         totalMembers VARCHAR(100)
//                     );
//                 `;
//                 await pool.query(createTableSql);
//             }

//             // Execute the original query
//             const result = await pool.query(sql, values);
//             // console.log('database connecting')
//             // console.log(result.rows)
//             resolve(result);
//         } catch (error) {
//             console.log('got error in query')
//             console.log(error.message)
//             reject(error);
//         }
//     });
// }

module.exports = {pool}