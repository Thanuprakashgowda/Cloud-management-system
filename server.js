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

require("./routes/student.routes.js")(app);
require("./routes/course.routes.js")(app);
require("./routes/department.routes.js")(app);
require("./routes/mark.routes.js")(app);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// End of file
