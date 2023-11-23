const express = require("express");
const GradeController = require("../controllers/GradeController");
const router = express.Router();

router.post("/grades/get-grade-teacher", GradeController.gradeForTeacher);
router.put("/grades/update-percent", GradeController.updatePercent);
router.post("/grades/get-grade-student", GradeController.gradeForStudent);
module.exports = router;