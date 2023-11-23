const express = require("express");
const CourseController = require("../controllers/CourseController");
const router = express.Router();

router.get("/get-course", CourseController.getAll);
router.post("/courses/create-course", CourseController.CreateCourse);
router.post("/courses/div-groups", CourseController.divGroup);
router.post("/courses/get-users", CourseController.getUsers);
router.get("/courses/participants/get", CourseController.getParticipants);
router.put("/update-course", CourseController.updateContent);

module.exports = router;
