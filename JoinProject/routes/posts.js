const express = require("express");
const PostsController = require("../controllers/PostsController");

const router = express.Router();

router.get("/posts", PostsController.getAll);
router.post("/posts", PostsController.create);
router.put("/posts", PostsController.updatePosts);
router.put("/posts-edit", PostsController.editPost);
router.put("/posts/delete-post", PostsController.deletePost);
router.put("/posts/notification", PostsController.updateNotification);
module.exports = router;
