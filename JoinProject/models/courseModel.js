const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  title: { type: String, default: "" },
  token: { type: String, default: "" },
  imagePath: { type: String, dafult: "" },
  assignment: { type: Number, default: 0 },
  countDownTime: { type: Date },
  contentCourse: [
    {
      key: { type: String },
      label: { type: String },
      data: { type: String, default: "" },
      icon: { type: String, default: "" },
      children: { type: Array, default: [] },
    },
  ],
  participants: [
    {
      userID: { type: String, default: "" },
      nameDisplay: {type: String, default: ''},
      isTeacher: { type: Boolean, dafault: false },
      isTeachingAssitant: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("course", courseSchema);
