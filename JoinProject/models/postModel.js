const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    tags: [String],
    imagePath: { type: String, default: "" },
    content: { type: String, default: "" },
    author: { type: String, required: true },
    nameAuthor: { type: String },
    like: { type: Array },
    notification: { type: Boolean },
    createDate: { type: String },
    idCourse: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);
