const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  id: { type: String, required: false },
  userID: String,
  courseID: { type: String, default: "" },
  courseName: { type: String, default: "" },
  isGrade: { type: Boolean, default: false },
  type: [
    [
      {
        id: Number,
        question: String,
        choice: [
          {
            name: String,
            text: String,
          },
        ],
        isCorrect: Boolean,
        answer: String,
        maxGrade: Number,
        grade: Number,
      },
    ],
    [
      {
        id: Number,
        question: {
          text: {type: String, default: ""},
          support: [],
        },
        file: [],
        maxGrade: {type: Number, default: 10},
        grade: Number,
      },
    ]
  ],
  startAt: {type: Date, default: Date.now()},
  endAt: {type: Date, default: Date.now()},
  
});

module.exports = mongoose.model("exam", examSchema);
