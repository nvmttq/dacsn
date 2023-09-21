const mongoose = require("mongoose");



const commentSchema = new mongoose.Schema({
  idComment: { type: String },
  idPost: { type: String, required: false },
  idUser: { type: String },
  title: { type: String, required: false },
  imagePath: { type: String, default: "" },
  content: { type: String, default: "" },
  createAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() },

  reply: { type: Array, default: [] },
});

module.exports = mongoose.model("comment", commentSchema);
