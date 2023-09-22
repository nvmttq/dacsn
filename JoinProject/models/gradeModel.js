const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  name: { type: String , default: ""},
  idUser: { type: String, required: false },
  idClassroom: { type: String, required: false },
  percent: { type: Number },
  grade: { type: Number}
});

module.exports = mongoose.model("grade", gradeSchema);
