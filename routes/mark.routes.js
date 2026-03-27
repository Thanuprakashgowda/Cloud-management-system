module.exports = app => {
    const marks = require("../controllers/mark.controller.js");
    var router = require("express").Router();

    router.get("/", marks.findAll);
    router.post("/", marks.create);
    router.put("/:id", marks.update);
    router.delete("/:id", marks.delete);

    app.use('/api/marks', router);
};
