module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
    var router = require("express").Router();

    // Register a new Admin
    router.post("/register", auth.register);

    // Login
    router.post("/login", auth.login);

    app.use('/api/auth', router);
};
