const express = require("express");
const AttendanceController = require("../controllers/AttendanceController");

const router = express.Router();
router.get("/courses-atten",AttendanceController.getAll);
router.post("/courses-atten",AttendanceController.create);
router.get("/courses-getC",AttendanceController.getAllCourse);
module.exports = router;