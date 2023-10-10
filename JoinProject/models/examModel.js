const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  id: { type: String, default: "" },
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
  endAt: { type: Date, default: Date.now },
  timlitmit: { type: Number, default: 5 },
});

module.exports = mongoose.model("exam", examSchema);
