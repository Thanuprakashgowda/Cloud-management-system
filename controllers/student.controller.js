const sql = require("../server.js");

// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Student
    const student = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        dob: req.body.dob,
        department_id: req.body.department_id
    };

    // Save Student in the database
    sql.query("INSERT INTO students SET ?", student, (err, res) => {
        if (err) {
            console.log("error: ", err);
            // result(err, null); // If we were using a model class
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Student."
            });
            return;
        }
        console.log("created student: ", { id: res.insertId, ...student });
        // result(null, { id: res.insertId, ...student });
        res.send({ id: res.insertId, ...student });
    });
};

// Retrieve all Students from the database (with Department name)
exports.findAll = (req, res) => {
    const query = `
        SELECT s.*, d.department_name 
        FROM students s 
        LEFT JOIN departments d ON s.department_id = d.department_id
    `;

    sql.query(query, (err, data) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving students."
            });
            return;
        }
        res.send(data);
    });
};

// Find a single Student with a studentId
exports.findOne = (req, res) => {
    const id = req.params.studentId;
    const query = `
        SELECT s.*, d.department_name 
        FROM students s 
        LEFT JOIN departments d ON s.department_id = d.department_id
        WHERE s.student_id = ?
    `;

    sql.query(query, [id], (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Student with id ${id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Student with id " + id
                });
            }
        } else {
            if (data.length) res.send(data[0]);
            else res.status(404).send({ message: `Not found Student with id ${id}.` });
        }
    });
};

// Update a Student identified by the studentId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const id = req.params.studentId;
    const student = req.body;

    sql.query(
        "UPDATE students SET first_name = ?, last_name = ?, email = ?, dob = ?, department_id = ? WHERE student_id = ?",
        [student.first_name, student.last_name, student.email, student.dob, student.department_id, id],
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Student with id ${id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Student with id " + id
                    });
                }
            } else {
                if (data.affectedRows == 0) {
                    // not found Student with the id
                    res.status(404).send({
                        message: `Not found Student with id ${id}.`
                    });
                    return;
                }
                res.send({ id: id, ...req.body });
            }
        }
    );
};

// Delete a Student with the specified studentId in the request
exports.delete = (req, res) => {
    const id = req.params.studentId;

    sql.query("DELETE FROM students WHERE student_id = ?", [id], (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Student with id ${id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Student with id " + id
                });
            }
        } else {
            if (data.affectedRows == 0) {
                // not found Student with the id
                res.status(404).send({
                    message: `Not found Student with id ${id}.`
                });
                return;
            }
            res.send({ message: `Student was deleted successfully!` });
        }
    });
};

// Delete all Students from the database.
exports.deleteAll = (req, res) => {
    sql.query("DELETE FROM students", (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all students."
            });
        } else res.send({ message: `All Students were deleted successfully!` });
    });
};
