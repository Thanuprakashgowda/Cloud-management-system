const sql = require("../database/db.js");

exports.create = (req, res) => {
    if (!req.body) return res.status(400).send({ message: "Content can not be empty!" });
    const course = {
        course_name: req.body.course_name,
        credits: req.body.credits,
        department_id: req.body.department_id || null,
        admin_id: req.adminId
    };
    sql.query("INSERT INTO courses SET ?", course, (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send({ id: data.insertId, ...course });
    });
};

exports.findAll = (req, res) => {
    const query = `
        SELECT c.*, d.department_name 
        FROM courses c
        LEFT JOIN departments d ON c.department_id = d.department_id
        WHERE c.admin_id = ?
        ORDER BY c.course_name
    `;
    sql.query(query, [req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send(data);
    });
};

exports.findOne = (req, res) => {
    const id = req.params.courseId;
    sql.query("SELECT * FROM courses WHERE course_id=? AND admin_id=?", [id, req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        if (data.length) res.send(data[0]);
        else res.status(404).send({ message: "Course not found." });
    });
};

exports.update = (req, res) => {
    const id = req.params.courseId;
    const c = req.body;
    sql.query(
        "UPDATE courses SET course_name=?, credits=?, department_id=? WHERE course_id=? AND admin_id=?",
        [c.course_name, c.credits, c.department_id, id, req.adminId],
        (err, data) => {
            if (err) return res.status(500).send({ message: err.message });
            if (data.affectedRows === 0) return res.status(404).send({ message: "Course not found." });
            res.send({ message: "Course updated." });
        }
    );
};

exports.delete = (req, res) => {
    const id = req.params.courseId;
    sql.query("DELETE FROM courses WHERE course_id=? AND admin_id=?", [id, req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        if (data.affectedRows === 0) return res.status(404).send({ message: "Course not found." });
        res.send({ message: "Course deleted successfully!" });
    });
};
