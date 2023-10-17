const express = require("express");
const GroupController = require("../controllers/GroupController");
const router = express.Router();


router.post("/groups/create-group", GroupController.CreateGroup);

module.exports = router;