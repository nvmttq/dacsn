const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  token: String,
  title: String,
  courseToken: { type: String },
  userStatus: [],
  CreateAt: { type: Date, default: Date.now },
  yes: {type: Number, default: 0},
  no: {type: Number, default: 0}
});
module.exports = mongoose.model("attendance", attendanceSchema);
