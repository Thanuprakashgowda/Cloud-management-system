module.exports = app => {
    const stats = require("../controllers/stats.controller.js");
    var router = require("express").Router();

    // Retrieve dashboard statistics
    router.get("/", stats.getDashboardStats);

    app.use('/api/stats', router);
};
