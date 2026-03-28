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
// We initialization the pool here to ensure it's ready. 
try {
    require("./database/db.js");
} catch (dbError) {
    console.error("CRITICAL: Failed to initialize database pool:", dbError);
}

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

app.use('/api/ai', verifyToken);
require("./routes/ai.routes.js")(app);

app.use('/api/attendance', require("./routes/attendance.routes.js"));

// Global Error Handler to prevent crashes on Vercel
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).send({ 
        message: "An internal server error occurred.",
        error: process.env.NODE_ENV === 'production' ? {} : err.message 
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
}

// Export app for Vercel Serverless Functions
module.exports = app;
