const sql = require("../database/db.js");

exports.create = (req, res) => {
    if (!req.body) return res.status(400).send({ message: "Content can not be empty!" });

    const student = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        dob: req.body.dob || null,
        department_id: req.body.department_id || null,
        admin_id: req.adminId
    };

    sql.query("INSERT INTO students SET ?", student, (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send({ id: data.insertId, ...student });
    });
};

exports.findAll = (req, res) => {
    const query = `
        SELECT s.*, CONCAT(s.first_name,' ',s.last_name) AS student_name, d.department_name 
        FROM students s 
        LEFT JOIN departments d ON s.department_id = d.department_id
        WHERE s.admin_id = ?
        ORDER BY s.first_name
    `;
    sql.query(query, [req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send(data);
    });
};

exports.findOne = (req, res) => {
    const id = req.params.studentId;
    const query = `
        SELECT s.*, d.department_name 
        FROM students s 
        LEFT JOIN departments d ON s.department_id = d.department_id
        WHERE s.student_id = ? AND s.admin_id = ?
    `;
    sql.query(query, [id, req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        if (data.length) res.send(data[0]);
        else res.status(404).send({ message: `Student not found.` });
    });
};

exports.update = (req, res) => {
    const id = req.params.studentId;
    const s = req.body;
    sql.query(
        "UPDATE students SET first_name=?, last_name=?, email=?, dob=?, department_id=? WHERE student_id=? AND admin_id=?",
        [s.first_name, s.last_name, s.email, s.dob, s.department_id, id, req.adminId],
        (err, data) => {
            if (err) return res.status(500).send({ message: err.message });
            if (data.affectedRows === 0) return res.status(404).send({ message: "Student not found." });
            res.send({ message: "Student updated." });
        }
    );
};

exports.delete = (req, res) => {
    const id = req.params.studentId;
    sql.query("DELETE FROM students WHERE student_id=? AND admin_id=?", [id, req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        if (data.affectedRows === 0) return res.status(404).send({ message: "Student not found." });
        res.send({ message: "Student deleted successfully!" });
    });
};

exports.deleteAll = (req, res) => {
    sql.query("DELETE FROM students WHERE admin_id = ?", [req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send({ message: `${data.affectedRows} Students deleted successfully!` });
    });
};
