const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

// Create a connection pool to the database
// pools handle dropped connections automatically which is necessary for serverless usage on Vercel
const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    waitForConnections: true,
    connectionLimit: dbConfig.pool ? dbConfig.pool.max : 10,
    queueLimit: 0
});

// Test the connection pool
pool.getConnection((error, connection) => {
    if (error) {
        console.error("DATA - Error connecting to the database: ", error);
    } else {
        console.log("DATA - Successfully connected to the database via pool.");
        connection.release();
    }
});

module.exports = pool;
