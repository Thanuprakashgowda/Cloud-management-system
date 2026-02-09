module.exports = app => {
    const courses = require("../controllers/course.controller.js");

    var router = require("express").Router();

    // Create a new Course
    router.post("/", courses.create);

    // Retrieve all Courses
    router.get("/", courses.findAll);

    // Retrieve a single Course with id
    router.get("/:courseId", courses.findOne);

    // Update a Course with id
    router.put("/:courseId", courses.update);

    // Delete a Course with id
    router.delete("/:courseId", courses.delete);

    app.use('/api/courses', router);
};
