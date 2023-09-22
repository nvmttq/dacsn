const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  id: { type: String, required: false },
  title: { type: String, required: false },
  tags: [String],
  imagePath: { type: String, default: "" },
  content: { type: String, default: "" },
  author: { type: String, required: true },
  idCourse: { type: String, required: false },
  comments: [
    {
      idComment: { type: String },
      idUser: { type: String },
      imagePath: { type: String, default: "" },
      content: { type: String, default: "" },

      reply: { type: Array, default: [] },
    }
  ],
}, {
  timestamps: true
});

module.exports = mongoose.model("post", postSchema);
