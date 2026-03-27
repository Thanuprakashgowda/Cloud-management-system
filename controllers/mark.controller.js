const sql = require("../database/db.js");

// Retrieve all Marks/Results
exports.findAll = (req, res) => {
    const query = `
        SELECT 
            e.enrollment_id,
            s.student_id,
            c.course_id,
            s.first_name,
            s.last_name,
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
        ORDER BY s.last_name, c.course_name;
    `;

    sql.query(query, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving results." });
            return;
        }
        res.send(data);
    });
};

// Create a new Result (Enroll student + set marks)
exports.create = (req, res) => {
    const { student_id, course_id, grade, marks } = req.body;

    if (!student_id || !course_id) {
        return res.status(400).send({ message: "Student and Course are required." });
    }

    const gradeValue = grade || null;
    const marksValue = marks !== undefined && marks !== '' ? parseInt(marks) : null;

    // Step 1: Create enrollment
    const enrollQuery = "INSERT INTO enrollments (student_id, course_id, grade) VALUES (?, ?, ?)";
    sql.query(enrollQuery, [parseInt(student_id), parseInt(course_id), gradeValue], (err, enrollResult) => {
        if (err) return res.status(500).send({ message: err.message });

        const enrollmentId = enrollResult.insertId;

        // Step 2: Insert mark if provided
        if (marksValue !== null) {
            const markQuery = "INSERT INTO marks (enrollment_id, marks) VALUES (?, ?)";
            sql.query(markQuery, [enrollmentId, marksValue], (err2) => {
                if (err2) return res.status(500).send({ message: err2.message });
                res.status(201).send({ message: "Result added successfully!", enrollment_id: enrollmentId });
            });
        } else {
            res.status(201).send({ message: "Enrollment created (no marks yet).", enrollment_id: enrollmentId });
        }
    });
};

// Delete a result (removes enrollment + marks via CASCADE)
exports.delete = (req, res) => {
    const enrollmentId = req.params.id;
    sql.query("DELETE FROM enrollments WHERE enrollment_id = ?", [enrollmentId], (err) => {
        if (err) return res.status(500).send({ message: err.message });
        res.status(200).send({ message: "Result deleted successfully." });
    });
};
