const sql = require("../database/db.js");

exports.create = (req, res) => {
    if (!req.body) return res.status(400).send({ message: "Content can not be empty!" });
    const dept = {
        department_name: req.body.department_name,
        head_of_dept: req.body.head_of_dept || null,
        admin_id: req.adminId
    };
    sql.query("INSERT INTO departments SET ?", dept, (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send({ id: data.insertId, ...dept });
    });
};

exports.findAll = (req, res) => {
    sql.query("SELECT * FROM departments WHERE admin_id = ? ORDER BY department_name", [req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        res.send(data);
    });
};

exports.findOne = (req, res) => {
    const id = req.params.departmentId;
    sql.query("SELECT * FROM departments WHERE department_id = ? AND admin_id = ?", [id, req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        if (data.length) res.send(data[0]);
        else res.status(404).send({ message: "Department not found." });
    });
};

exports.update = (req, res) => {
    const id = req.params.departmentId;
    const d = req.body;
    sql.query(
        "UPDATE departments SET department_name=?, head_of_dept=? WHERE department_id=? AND admin_id=?",
        [d.department_name, d.head_of_dept, id, req.adminId],
        (err, data) => {
            if (err) return res.status(500).send({ message: err.message });
            if (data.affectedRows === 0) return res.status(404).send({ message: "Department not found." });
            res.send({ message: "Department updated." });
        }
    );
};

exports.delete = (req, res) => {
    const id = req.params.departmentId;
    sql.query("DELETE FROM departments WHERE department_id=? AND admin_id=?", [id, req.adminId], (err, data) => {
        if (err) return res.status(500).send({ message: err.message });
        if (data.affectedRows === 0) return res.status(404).send({ message: "Department not found." });
        res.send({ message: "Department deleted successfully!" });
    });
};
