const mongoose = require("mongoose");



const commentSchema = new mongoose.Schema({
  idPost: { type: String, required: false },
  idUser: { type: String },
  nameUser: {type: String},
  imagePath: { type: String, default: "" },
  content: { type: String, default: "" },
  createDate: { type: String },
  updateAt: { type: Date, default: Date.now() },

  reply: { type: Array, default: [] },
});

module.exports = mongoose.model("comment", commentSchema);
