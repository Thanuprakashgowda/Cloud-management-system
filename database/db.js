const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// Open the MySQL connection
connection.connect(error => {
    if (error) {
        console.error("DATA - Error connecting to the database: ", error); // specific prefix to find in logs
    } else {
        console.log("DATA - Successfully connected to the database.");
    }
});

module.exports = connection;
