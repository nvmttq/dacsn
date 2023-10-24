const express = require("express");
const GroupController = require("../controllers/GroupController");
const router = express.Router();


router.post("/groups/create-group", GroupController.CreateGroup);
router.post("/groups/get-groups-in-course", GroupController.getGroupsInCourse);
module.exports = router;