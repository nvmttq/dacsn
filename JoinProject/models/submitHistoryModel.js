const mongoose = require("mongoose");

const submitHistorySchema = new mongoose.Schema({
  idUser: {
    type: String,
  },
  idExam: {
    type: String,
  },
  lastSubmit: {
    type: String,
  },
  point: {
    type: String,
  },
  correctAnswer: {
    type: String,
  },
  numberOfCorrect: {
    type: Number,
  },
  exam: {
    type: Object,
  },
});

module.exports = mongoose.model("submitHistory", submitHistorySchema);
