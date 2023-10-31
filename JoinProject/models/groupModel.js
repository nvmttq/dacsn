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
  conversations: [
    {
      userID: String,
      nameDisplay: String,
      time_send: { type: Date, default: Date.now() },
      content: {
        file: [String],
        text: { type: String, default: "" },
        emote: { type: String, default: "" },
      },
    },
  ],
});

module.exports = mongoose.model('group',groupSchema)