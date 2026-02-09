module.exports = app => {
    const marks = require("../controllers/mark.controller.js");

    var router = require("express").Router();

    // Retrieve all Marks (Results view)
    router.get("/", marks.findAll);

    app.use('/api/marks', router);
};
