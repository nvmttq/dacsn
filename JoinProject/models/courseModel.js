const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  title: { type: String, default: "" },
  token: { type: String, default: "" },
  imagePath: { type: String, default: "" },
  assignment: { type: Number, default: 0 },
  countDownTime: { type: Date },
  contentCourse: { type: Array },
  hk: {type: String, default: ""},
  yearFrom: {type: String, default: ""},
  yearTo: {type: String, default: ""},
  participants: [
    {
      userID: { type: String, default: "" },
      nameDisplay: { type: String, default: "" },
      isTeacher: { type: Boolean, default: false },
      isTeachingAssitant: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("course", courseSchema);
