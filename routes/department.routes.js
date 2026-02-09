module.exports = app => {
    const departments = require("../controllers/department.controller.js");

    var router = require("express").Router();

    // Create a new Department
    router.post("/", departments.create);

    // Retrieve all Departments
    router.get("/", departments.findAll);

    // Retrieve a single Department with id
    router.get("/:departmentId", departments.findOne);

    // Update a Department with id
    router.put("/:departmentId", departments.update);

    // Delete a Department with id
    router.delete("/:departmentId", departments.delete);

    app.use('/api/departments', router);
};
