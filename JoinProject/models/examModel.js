const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  courseToken: {type: String, default: ""},
  name: String,
  questions: [
    {
      id: String,
      textQues: String,
      choice: [{ name: String, textChoice: String, userChoose: [String] }],
      answer: String,
      gradeQues: { type: Number, default: 0 },
    },
  ],
  isReview: { type: Boolean, default: true },
  startAt: { type: Date, default: Date.now },
  endAt: { type: Date, default: Date.now},
  timelimit: { type: Number, default: 5 },
  numberOfTimes: {type: Number, default: 0},
  userStatus: [
    {userID: String, status: {type: Number, default: 0}, timeStart: {type:Date, default: Date.now}}
  ],
});

module.exports = mongoose.model("exam", examSchema);
