const express = require("express");
const SubmitHistoryController = require("../controllers/SubmitHistoryController");

const router = express.Router();

router.get("/get-submitHistory", SubmitHistoryController.getAll);
router.post("/post-submitHistory", SubmitHistoryController.create);

module.exports = router;
