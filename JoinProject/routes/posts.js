const express = require("express");
const PostsController = require("../controllers/PostsController");

const router = express.Router();

router.get("/posts", PostsController.getAll);
router.post("/posts", PostsController.create);
router.put("/posts", PostsController.updatePosts);

module.exports = router;
