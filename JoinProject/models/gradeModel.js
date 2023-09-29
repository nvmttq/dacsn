const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  id: {type: String, default: ''},
  name: { type: String , default: ""},
  idUser: { type: String, required: false },
  courseToken: { type: String, required: false },
  examToken: {type: String, default: ""},
  status: {type: String, default: "Chưa hoàn thành"},
  grade: { type: Number},
  percent: { type: Number },
  createAt: {type: Date, default: Date.now()},
  endAt: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("grade", gradeSchema);
