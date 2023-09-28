const express = require("express");
const PostsController = require("../controllers/PostsController");

const router = express.Router();

router.get("/posts", PostsController.getAll);
router.post("/posts", PostsController.create);

module.exports = router;
