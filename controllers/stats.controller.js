const sql = require("../database/db.js");

exports.getDashboardStats = (req, res) => {
    const queries = {
        students: "SELECT COUNT(*) as count FROM students",
        courses: "SELECT COUNT(*) as count FROM courses",
        departments: "SELECT COUNT(*) as count FROM departments",
        deptDistribution: `
            SELECT d.department_name, COUNT(s.student_id) as student_count 
            FROM departments d 
            LEFT JOIN students s ON d.department_id = s.department_id 
            GROUP BY d.department_id
            HAVING student_count > 0
        `,
        courseAverages: `
            SELECT c.course_name, ROUND(AVG(m.marks), 1) as average_marks
            FROM courses c
            JOIN enrollments e ON c.course_id = e.course_id
            JOIN marks m ON e.enrollment_id = m.enrollment_id
            GROUP BY c.course_id
            ORDER BY average_marks DESC
        `
    };

    let results = {};
    let pending = Object.keys(queries).length;
    let hasError = false;

    for (let key in queries) {
        sql.query(queries[key], (err, data) => {
            if (hasError) return;
            if (err) {
                hasError = true;
                console.error(`Stats query [${key}] failed:`, err.message);
                return res.status(500).send({ message: `Error fetching stats: ${err.message}` });
            }
            results[key] = data;
            pending--;
            if (pending === 0) {
                res.send({
                    totals: {
                        students: results.students[0].count,
                        courses: results.courses[0].count,
                        departments: results.departments[0].count
                    },
                    departmentDistribution: results.deptDistribution,
                    coursePerformance: results.courseAverages
                });
            }
        });
    }
};
