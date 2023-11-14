const express = require("express");
const GradeController = require("../controllers/GradeController");
const router = express.Router();

router.post("/grades/get-grade-teacher", GradeController.gradeForTeacher);
router.post("/grades/get-grade-student", GradeController.gradeForStudent);
module.exports = router;