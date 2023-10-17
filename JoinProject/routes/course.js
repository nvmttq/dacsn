const express = require("express");
const CourseController = require("../controllers/CourseController");
const router = express.Router();

router.get("/get-course", CourseController.getAll);
router.post("/courses/create-course", CourseController.CreateCourse);

module.exports = router;
