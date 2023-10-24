const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  id: { type: String, required: false },
  title: { type: String, required: false },
  courseToken: {type: String, default: ""},
  token: { type: String, default: "" },
  participants: [{
    userID: { type: String, default: ""},
    nameDisplay: {type: String, default: ""},
    isCreator: {type: Boolean, default: false}
  }],
});

module.exports = mongoose.model('group',groupSchema)