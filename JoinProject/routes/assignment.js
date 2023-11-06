const express = require("express");
const AssignmentController = require("../controllers/AssignmentController");
const router = express.Router();

router.put("/assignments/set-grade", AssignmentController.setGrade);
router.post("/assignments/get-assign", AssignmentController.getAssignment);
router.post("/assignments/submit-ass", AssignmentController.submitAssignment)
module.exports = router;