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

// Database Connection is handled in individual controllers via database/db.js
// We don't need to require it here for the app to start, but good to check connection once
require("./database/db.js");

// Routes
// Simple route for testing
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const verifyToken = require("./middleware/verifyToken.js");

// Public Auth Route
require("./routes/auth.routes.js")(app);

// Protected API Routes
app.use('/api/students', verifyToken);
require("./routes/student.routes.js")(app);

app.use('/api/courses', verifyToken);
require("./routes/course.routes.js")(app);

app.use('/api/departments', verifyToken);
require("./routes/department.routes.js")(app);

app.use('/api/marks', verifyToken);
require("./routes/mark.routes.js")(app);

app.use('/api/stats', verifyToken);
require("./routes/stats.routes.js")(app);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// Export app for Vercel Serverless Functions
module.exports = app;
