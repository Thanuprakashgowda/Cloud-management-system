module.exports = app => {
    const ai = require("../controllers/ai.controller.js");
    var router = require("express").Router();

    // Generate executive dashboard summary
    router.post("/report", ai.generateDashboardReport);

    // Generate specific student action plan
    router.post("/student", ai.generateStudentPlan);

    app.use('/api/ai', router);
};
