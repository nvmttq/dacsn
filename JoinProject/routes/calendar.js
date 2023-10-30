const express = require("express");
const CalendarController = require("../controllers/CalendarController");

const router = express.Router();

router.get("/lich", CalendarController.getAll);
router.post("/lich", CalendarController.create);


module.exports = router;
