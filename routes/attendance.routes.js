const express = require("express");
const router = express.Router();
const attendance = require("../controllers/attendance.controller.js");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/history", verifyToken, attendance.getHistory);
router.get("/stats", verifyToken, attendance.getStats);
router.get("/", verifyToken, attendance.getByDate);
router.post("/", verifyToken, attendance.markAttendance);

module.exports = router;
