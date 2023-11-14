const express = require("express");
const CommentController = require("../controllers/CommentController");

const router = express.Router();

router.get("/comments", CommentController.getAll);
router.post("/comments", CommentController.create);
router.put("/comments", CommentController.updateComment);
router.put("/like-comments", CommentController.updateLikeComment);

module.exports = router;
