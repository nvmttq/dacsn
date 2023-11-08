const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    idCourse: { type: String },
    listStudent: { type: Object },
  },
);
module.exports = mongoose.model("attendance", attendanceSchema);
