module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
    const verifyToken = require("../middleware/verifyToken.js");
    var router = require("express").Router();

    // Register a new Admin
    router.post("/register", auth.register);

    // Login
    router.post("/login", auth.login);

    // Get current admin profile (protected)
    router.get("/profile", verifyToken, auth.getProfile);

    app.use('/api/auth', router);
};
