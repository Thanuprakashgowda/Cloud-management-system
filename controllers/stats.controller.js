const sql = require("../database/db.js");

exports.getDashboardStats = (req, res) => {
    const adminId = req.adminId;
    const queries = {
        students: ["SELECT COUNT(*) as count FROM students WHERE admin_id = ?", [adminId]],
        courses: ["SELECT COUNT(*) as count FROM courses WHERE admin_id = ?", [adminId]],
        departments: ["SELECT COUNT(*) as count FROM departments WHERE admin_id = ?", [adminId]],
        deptDistribution: [`
            SELECT d.department_name, COUNT(s.student_id) as student_count 
            FROM departments d 
            LEFT JOIN students s ON d.department_id = s.department_id AND s.admin_id = ?
            WHERE d.admin_id = ?
            GROUP BY d.department_id
            HAVING student_count > 0
        `, [adminId, adminId]],
        courseAverages: [`
            SELECT c.course_name, ROUND(AVG(m.marks), 1) as average_marks
            FROM courses c
            JOIN enrollments e ON c.course_id = e.course_id
            JOIN marks m ON e.enrollment_id = m.enrollment_id
            WHERE c.admin_id = ?
            GROUP BY c.course_id
            ORDER BY average_marks DESC
        `, [adminId]]
    };

    let results = {};
    let pending = Object.keys(queries).length;
    let hasError = false;

    for (let key in queries) {
        const [sqlQuery, params] = queries[key];
        sql.query(sqlQuery, params, (err, data) => {
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
                        students: results.students[0] ? results.students[0].count : 0,
                        courses: results.courses[0] ? results.courses[0].count : 0,
                        departments: results.departments[0] ? results.departments[0].count : 0
                    },
                    departmentDistribution: results.deptDistribution,
                    coursePerformance: results.courseAverages
                });
            }
        });
    }
};
