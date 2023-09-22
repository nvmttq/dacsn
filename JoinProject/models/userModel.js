const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  idUser: { type: String, required: true },
  firstName: { type: String },
  latsName: { type: String },
  nameDisplay: { type: String },
  birthDate: { type: Date, required: false },
  address: { type: String, required: false },
  courses: { type: Array, default: [] },
});

module.exports = mongoose.model("user", userSchema);
