const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: { type: String},
  password: {type: String},
  name: {type: String},
  role: String,
  courses: [],
  groups: []
});

module.exports = mongoose.model("user", user);
