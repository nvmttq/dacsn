const mongoose = require("mongoose");


const dkmhSchema = new mongoose.Schema({
  id: {type: String, default: ""},
  courseID: {type: String, default: ""},
  courseFullName: {type: String, default: ""},
  courseShortName: {type: String, default: ""},
  contentSubjectID: {type: String, default: ""},
  participants: [{
    userID: {type: String, default: ""},
    fullName: {type: String, default: ""},
    role: {type: String, default: ""},
  }],
  startDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model("dkmh", dkmhSchema);
