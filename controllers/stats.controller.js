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
        `,
        courseAverages: `
            SELECT c.course_name, AVG(m.marks) as average_marks 
            FROM courses c 
            JOIN marks m ON c.course_id = m.course_id 
            GROUP BY c.course_id
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
                return res.status(500).send({ message: "Error fetching stats" });
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
