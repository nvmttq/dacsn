const express = require("express");
const AttendanceController = require("../controllers/AttendanceController");

const router = express.Router();
router.get("/attendances/:courseToken",AttendanceController.getAll);
router.post("/courses-atten",AttendanceController.create);
router.post("/attendances/submit-atten", AttendanceController.submitAttendance);
router.post("/attendances/create", AttendanceController.createAttendance);
module.exports = router;