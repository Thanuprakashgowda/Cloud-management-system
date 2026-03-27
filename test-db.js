require('dotenv').config();
const mysql = require("mysql2");
const dbConfig = require("./config/db.config.js");
console.log("Config:", dbConfig);
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    connectTimeout: 5000
});
console.log("Connecting...");
connection.connect(error => {
    if (error) console.error("Error:", error);
    else console.log("Success");
    process.exit(0);
});
