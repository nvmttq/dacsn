const express = require("express");
const GradeController = require("../controllers/GradeController");
const router = express.Router();

router.post("/grades/get-grade-teacher", GradeController.gradeForTeacher);
module.exports = router;