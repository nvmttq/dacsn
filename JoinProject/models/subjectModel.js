const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subjectID: {type: String, default: ""},
  name: {type:String, default: ""},
  contentCourse: [
    {
      key: { type: String },
      label: { type: String },
      data: { type: String, default: "" },
      icon: { type: String, default: "" },
      children: { type: Array, default: [] },
    },
  ],
  
});

module.exports = mongoose.model("subject", SubjectSchema);
