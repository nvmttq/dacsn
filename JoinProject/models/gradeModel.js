const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  idUser: { type: String, required: false },
  idClassroom: { type: String, required: false },
  percent: { type: Number },
  courseTotal: { type: Number },
});

module.exports = mongoose.model("grade", gradeSchema);
