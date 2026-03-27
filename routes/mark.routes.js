module.exports = app => {
    const marks = require("../controllers/mark.controller.js");
    var router = require("express").Router();

    // Get all results
    router.get("/", marks.findAll);

    // Add a new result (enroll + marks)
    router.post("/", marks.create);

    // Delete a result by enrollment_id
    router.delete("/:id", marks.delete);

    app.use('/api/marks', router);
};
