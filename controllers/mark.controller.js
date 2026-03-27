const sql = require("../database/db.js");

// Retrieve all Marks/Results for this admin only
exports.findAll = (req, res) => {
    const query = `
        SELECT 
            e.enrollment_id,
            s.student_id,
            c.course_id,
            CONCAT(s.first_name,' ',s.last_name) AS student_name,
            c.course_name,
            d.department_name,
            e.grade,
            m.marks,
            m.mark_id
        FROM enrollments e
        JOIN students s ON e.student_id = s.student_id
        JOIN courses c ON e.course_id = c.course_id
        LEFT JOIN departments d ON s.department_id = d.department_id
        LEFT JOIN marks m ON e.enrollment_id = m.enrollment_id
        WHERE s.admin_id = ?
        ORDER BY s.first_name, c.course_name
    `;
    sql.query(query, [req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send(data);
    });
};

// Create a new Result (Enroll student + set marks)
exports.create = (req, res) => {
    const { student_id, course_id, grade, marks } = req.body;
    if (!student_id || !course_id) {
        return res.status(400).send({ message: "Student and Course are required." });
    }

    // Verify student belongs to this admin
    sql.query("SELECT student_id FROM students WHERE student_id=? AND admin_id=?", [student_id, req.adminId], (err, rows) => {
        if (err) return res.status(500).send({ message: err.message });
        if (!rows.length) return res.status(403).send({ message: "Student not found for this account." });

        const gradeValue = grade || null;
        const marksValue = marks !== undefined && marks !== '' ? parseInt(marks) : null;

        const enrollQuery = "INSERT INTO enrollments (student_id, course_id, grade) VALUES (?, ?, ?)";
        sql.query(enrollQuery, [parseInt(student_id), parseInt(course_id), gradeValue], (err, enrollResult) => {
            if (err) return res.status(500).send({ message: err.message });
            const enrollmentId = enrollResult.insertId;

            if (marksValue !== null) {
                sql.query("INSERT INTO marks (enrollment_id, marks) VALUES (?, ?)", [enrollmentId, marksValue], (err2) => {
                    if (err2) return res.status(500).send({ message: err2.message });
                    res.status(201).send({ message: "Result added successfully!", enrollment_id: enrollmentId });
                });
            } else {
                res.status(201).send({ message: "Enrollment created.", enrollment_id: enrollmentId });
            }
        });
    });
};

// Update a result (grade + marks)
exports.update = (req, res) => {
    const enrollmentId = req.params.id;
    const { grade, marks } = req.body;
    const marksValue = marks !== undefined && marks !== '' ? parseInt(marks) : null;

    // Verify ownership via student's admin_id
    const checkQ = `
        SELECT e.enrollment_id FROM enrollments e
        JOIN students s ON e.student_id = s.student_id
        WHERE e.enrollment_id = ? AND s.admin_id = ?
    `;
    sql.query(checkQ, [enrollmentId, req.adminId], (err, rows) => {
        if (err) return res.status(500).send({ message: err.message });
        if (!rows.length) return res.status(403).send({ message: "Result not found for this account." });

        sql.query("UPDATE enrollments SET grade=? WHERE enrollment_id=?", [grade || null, enrollmentId], (err2) => {
            if (err2) return res.status(500).send({ message: err2.message });

            if (marksValue !== null) {
                // Upsert marks
                const upsertQ = `
                    INSERT INTO marks (enrollment_id, marks) VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE marks = VALUES(marks)
                `;
                sql.query(upsertQ, [enrollmentId, marksValue], (err3) => {
                    if (err3) return res.status(500).send({ message: err3.message });
                    res.send({ message: "Result updated successfully." });
                });
            } else {
                res.send({ message: "Result updated successfully." });
            }
        });
    });
};

// Delete a result (removes enrollment + marks via CASCADE)
exports.delete = (req, res) => {
    const enrollmentId = req.params.id;
    const checkQ = `
        SELECT e.enrollment_id FROM enrollments e
        JOIN students s ON e.student_id = s.student_id
        WHERE e.enrollment_id = ? AND s.admin_id = ?
    `;
    sql.query(checkQ, [enrollmentId, req.adminId], (err, rows) => {
        if (err) return res.status(500).send({ message: err.message });
        if (!rows.length) return res.status(403).send({ message: "Result not found for this account." });

        sql.query("DELETE FROM enrollments WHERE enrollment_id=?", [enrollmentId], (err2) => {
            if (err2) return res.status(500).send({ message: err2.message });
            res.send({ message: "Result deleted successfully." });
        });
    });
};
