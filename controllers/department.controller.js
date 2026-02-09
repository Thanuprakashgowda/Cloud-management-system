const sql = require("../database/db.js");

// Create and Save a new Department
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Department
    const department = {
        department_name: req.body.department_name,
        head_of_dept: req.body.head_of_dept
    };

    // Save Department in the database
    sql.query("INSERT INTO departments SET ?", department, (err, res) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Department."
            });
            return;
        }
        console.log("created department: ", { id: res.insertId, ...department });
        res.send({ id: res.insertId, ...department });
    });
};

// Retrieve all Departments from the database.
exports.findAll = (req, res) => {
    sql.query("SELECT * FROM departments", (err, data) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving departments."
            });
            return;
        }
        res.send(data);
    });
};

// Find a single Department with a departmentId
exports.findOne = (req, res) => {
    const id = req.params.departmentId;

    sql.query("SELECT * FROM departments WHERE department_id = ?", [id], (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Department with id ${id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Department with id " + id
                });
            }
        } else {
            if (data.length) res.send(data[0]);
            else res.status(404).send({ message: `Not found Department with id ${id}.` });
        }
    });
};

// Update a Department identified by the departmentId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const id = req.params.departmentId;
    const department = req.body;

    sql.query(
        "UPDATE departments SET department_name = ?, head_of_dept = ? WHERE department_id = ?",
        [department.department_name, department.head_of_dept, id],
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Department with id ${id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Department with id " + id
                    });
                }
            } else {
                if (data.affectedRows == 0) {
                    res.status(404).send({
                        message: `Not found Department with id ${id}.`
                    });
                    return;
                }
                res.send({ id: id, ...req.body });
            }
        }
    );
};

// Delete a Department with the specified departmentId in the request
exports.delete = (req, res) => {
    const id = req.params.departmentId;

    sql.query("DELETE FROM departments WHERE department_id = ?", [id], (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Department with id ${id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Department with id " + id
                });
            }
        } else {
            if (data.affectedRows == 0) {
                res.status(404).send({
                    message: `Not found Department with id ${id}.`
                });
                return;
            }
            res.send({ message: `Department was deleted successfully!` });
        }
    });
};
