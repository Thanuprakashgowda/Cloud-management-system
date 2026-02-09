require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const dbConfig = require("./config/db.config.js");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Database Connection
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

connection.connect(error => {
    if (error) {
        console.error("Successfully connected to the database.");
        // In a real app, we might want to retry or exit
        // console.error("Error connecting to the database: ", error);
        // return;
    } else {
        console.log("Successfully connected to the database.");
    }
});

// Routes
// Simple route for testing
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

require("./routes/student.routes.js")(app);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// Export connection for use in controllers/models
module.exports = connection;
