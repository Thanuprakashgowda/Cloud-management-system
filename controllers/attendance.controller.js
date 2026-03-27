const sql = require("../database/db.js");

// GET /api/attendance?date=YYYY-MM-DD — all students for this admin with their status for that date
exports.getByDate = (req, res) => {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const query = `
        SELECT s.student_id, CONCAT(s.first_name, ' ', s.last_name) AS student_name, d.department_name,
               a.status
        FROM students s
        LEFT JOIN departments d ON s.department_id = d.department_id
        LEFT JOIN attendance a ON s.student_id = a.student_id AND a.date = ?
        WHERE s.admin_id = ?
        ORDER BY s.first_name, s.last_name
    `;
    sql.query(query, [date, req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: "Error fetching attendance: " + err.message });
        res.send(data);
    });
};

// POST /api/attendance — save attendance records for a date
// body: { date: "YYYY-MM-DD", records: [{student_id, status}] }
exports.markAttendance = (req, res) => {
    const { date, records } = req.body;
    if (!date || !records || !records.length) {
        return res.status(400).send({ message: "Date and records are required." });
    }

    // Security check: verify all students belong to this admin
    const studentIds = records.map(r => r.student_id);
    const verifyQuery = "SELECT student_id FROM students WHERE student_id IN (?) AND admin_id = ?";
    sql.query(verifyQuery, [studentIds, req.adminId], (err, verifiedStudents) => {
        if (err) return res.status(500).send({ message: "Security verification failed: " + err.message });
        
        const verifiedIds = verifiedStudents.map(s => s.student_id);
        const validRecords = records.filter(r => verifiedIds.includes(r.student_id));

        if (!validRecords.length) {
            return res.status(403).send({ message: "No authorized students found for this account." });
        }

        // Use INSERT ... ON DUPLICATE KEY UPDATE for upsert behaviour
        const values = validRecords.map(r => [r.student_id, date, r.status]);
        const query = `
            INSERT INTO attendance (student_id, date, status)
            VALUES ?
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        `;
        sql.query(query, [values], (err) => {
            if (err) return res.status(500).send({ message: "Error saving attendance: " + err.message });
            res.send({ message: "Attendance saved successfully." });
        });
    });
};

// GET /api/attendance/history — last 30 days attendance records for this admin
exports.getHistory = (req, res) => {
    const query = `
        SELECT CONCAT(s.first_name, ' ', s.last_name) AS student_name, a.date, a.status
        FROM attendance a
        JOIN students s ON a.student_id = s.student_id
        WHERE s.admin_id = ? AND a.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        ORDER BY a.date DESC, s.first_name ASC
    `;
    sql.query(query, [req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: "Error fetching history: " + err.message });
        res.send(data);
    });
};

// GET /api/attendance/stats — attendance % per student for this admin
exports.getStats = (req, res) => {
    const query = `
        SELECT CONCAT(s.first_name, ' ', s.last_name) AS student_name,
               COUNT(a.attendance_id) as total_days,
               SUM(a.status = 'present') as present_days,
               SUM(a.status = 'absent') as absent_days,
               SUM(a.status = 'late') as late_days,
               ROUND(SUM(a.status = 'present') / COUNT(a.attendance_id) * 100, 1) as attendance_pct
        FROM students s
        LEFT JOIN attendance a ON s.student_id = a.student_id
        WHERE s.admin_id = ?
        GROUP BY s.student_id
        ORDER BY attendance_pct ASC
    `;
    sql.query(query, [req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: "Error fetching stats: " + err.message });
        res.send(data);
    });
};
