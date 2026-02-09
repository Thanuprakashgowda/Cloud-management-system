const sql = require("../database/db.js");

// Create and Save a new Course
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Course
    const course = {
        course_name: req.body.course_name,
        credits: req.body.credits,
        department_id: req.body.department_id
    };

    // Save Course in the database
    sql.query("INSERT INTO courses SET ?", course, (err, res) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Course."
            });
            return;
        }
        console.log("created course: ", { id: res.insertId, ...course });
        res.send({ id: res.insertId, ...course });
    });
};

// Retrieve all Courses from the database (with Department Name)
exports.findAll = (req, res) => {
    const query = `
        SELECT c.*, d.department_name 
        FROM courses c
        LEFT JOIN departments d ON c.department_id = d.department_id
    `;
    sql.query(query, (err, data) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving courses."
            });
            return;
        }
        res.send(data);
    });
};

// Find a single Course with a courseId
exports.findOne = (req, res) => {
    const id = req.params.courseId;
    const query = `
        SELECT c.*, d.department_name 
        FROM courses c
        LEFT JOIN departments d ON c.department_id = d.department_id
        WHERE c.course_id = ?
    `;

    sql.query(query, [id], (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Course with id ${id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Course with id " + id
                });
            }
        } else {
            if (data.length) res.send(data[0]);
            else res.status(404).send({ message: `Not found Course with id ${id}.` });
        }
    });
};

// Update a Course identified by the courseId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const id = req.params.courseId;
    const course = req.body;

    sql.query(
        "UPDATE courses SET course_name = ?, credits = ?, department_id = ? WHERE course_id = ?",
        [course.course_name, course.credits, course.department_id, id],
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Course with id ${id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Course with id " + id
                    });
                }
            } else {
                if (data.affectedRows == 0) {
                    res.status(404).send({
                        message: `Not found Course with id ${id}.`
                    });
                    return;
                }
                res.send({ id: id, ...req.body });
            }
        }
    );
};

// Delete a Course with the specified courseId in the request
exports.delete = (req, res) => {
    const id = req.params.courseId;

    sql.query("DELETE FROM courses WHERE course_id = ?", [id], (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Course with id ${id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Course with id " + id
                });
            }
        } else {
            if (data.affectedRows == 0) {
                res.status(404).send({
                    message: `Not found Course with id ${id}.`
                });
                return;
            }
            res.send({ message: `Course was deleted successfully!` });
        }
    });
};
