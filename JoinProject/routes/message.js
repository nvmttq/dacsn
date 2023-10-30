const express = require("express");
const MessageController = require("../controllers/MessageController")
const router = express.Router();

router.get("/groups",MessageController.getAll);

module.exports = router;