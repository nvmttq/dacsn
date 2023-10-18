const express = require("express");
const CourseController = require("../controllers/CourseController");
const router = express.Router();

router.get("/get-course", CourseController.getAll);
router.post("/courses/create-course", CourseController.CreateCourse);
router.put("/update-course", CourseController.updateContent);

module.exports = router;
