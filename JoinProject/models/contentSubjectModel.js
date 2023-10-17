const mongoose = require("mongoose");


const contentSubjectSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  name: {type: String, default: ""},
  creator: {type: String, default: ""},
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

module.exports = mongoose.model("contentSubject", contentSubjectSchema);
