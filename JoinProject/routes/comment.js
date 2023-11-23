const express = require("express");
const CommentController = require("../controllers/CommentController");

const router = express.Router();

router.get("/comments", CommentController.getAll);
router.post("/comments", CommentController.create);
router.put("/comments", CommentController.updateComment);
router.put("/like-comments", CommentController.updateLikeComment);
router.put("/delete-comments", CommentController.deleteComment);
router.put("/delete-reply", CommentController.updateReply);

module.exports = router;
