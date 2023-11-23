const express = require("express");
const GroupController = require("../controllers/GroupController");
const router = express.Router();

router.get("/groups/:groupToken", GroupController.getGroup);
router.post("/groups/create-group", GroupController.CreateGroup);
router.post("/groups/get-groups-in-course", GroupController.getGroupsInCourse);
router.put("/groups/update-participant", GroupController.updateParticipant);
module.exports = router;
