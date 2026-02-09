module.exports = app => {
    const students = require("../controllers/student.controller.js");

    var router = require("express").Router();

    // Create a new Student
    router.post("/", students.create);

    // Retrieve all Students
    router.get("/", students.findAll);

    // Retrieve a single Student with id
    router.get("/:studentId", students.findOne);

    // Update a Student with id
    router.put("/:studentId", students.update);

    // Delete a Student with id
    router.delete("/:studentId", students.delete);

    // Delete all Students
    router.delete("/", students.deleteAll);

    app.use('/api/students', router);
};
