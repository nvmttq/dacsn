const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  title: { type: String, default: "" },
  assignmentToken: { type: String, default: "" },
  courseToken: { type: String, default: "" },
  content: {
    text: { type: String, default: "" },
    file: [String],
  },
  percent: {type: Number, default: 0},
  timeStart: { type: Date },
  timeEnd: { type: Date },
  userStatus: [
    {
      participants: [String],
      assignmented: [
      ],
      grade: { type: Number, default: 0 },
      dateSubmit: Date,
      status: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("assignment", AssignmentSchema);
