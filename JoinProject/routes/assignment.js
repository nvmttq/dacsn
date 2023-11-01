const express = require("express");
const AssignmentController = require("../controllers/AssignmentController");
const router = express.Router();



router.post("/assignments/submit-ass", AssignmentController.submitAssignment)
module.exports = router;