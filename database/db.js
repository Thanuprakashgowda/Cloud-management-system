const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

// Create a connection pool to the database
// pools handle dropped connections automatically which is necessary for serverless usage on Vercel
const poolOptions = {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: dbConfig.PORT,
    waitForConnections: true,
    connectionLimit: dbConfig.pool ? dbConfig.pool.max : 10,
    queueLimit: 0
};

// Extremely Important: Cloud Databases like TiDB Cloud REQUIRE SSL encrypton.
// We apply SSL strictly when not hosting locally. 
if (dbConfig.HOST !== 'localhost' && dbConfig.HOST !== '127.0.0.1') {
    poolOptions.ssl = { minVersion: 'TLSv1.2', rejectUnauthorized: true };
}

const pool = mysql.createPool(poolOptions);

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
