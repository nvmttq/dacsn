const express = require("express");
const CourseController = require("../controllers/GroupController");
const router = express.Router();


router.post("/groups/create-group", GroupController.CreateCourse);

module.exports = router;
