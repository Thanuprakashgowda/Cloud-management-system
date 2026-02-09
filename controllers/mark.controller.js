const sql = require("../database/db.js");

// Retrieve all Marks/Results
exports.findAll = (req, res) => {
    const query = `
        SELECT 
            e.enrollment_id,
            s.first_name,
            s.last_name,
            c.course_name,
            d.department_name,
            e.grade,
            m.marks
        FROM enrollments e
        JOIN students s ON e.student_id = s.student_id
        JOIN courses c ON e.course_id = c.course_id
        JOIN departments d ON s.department_id = d.department_id
        LEFT JOIN marks m ON e.enrollment_id = m.enrollment_id
        ORDER BY s.last_name, c.course_name;
    `;

    sql.query(query, (err, data) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving results."
            });
            return;
        }
        res.send(data);
    });
};
