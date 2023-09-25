const mongoose = require("mongoose");

const test = new mongoose.Schema({
  id: { type: String, default: "" },
});

module.exports = mongoose.model("test", test);
