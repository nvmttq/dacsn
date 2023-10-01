const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  idMeeting: { type: String, required: false },
  title: { type: String, required: false },
  idCourse: { type: String, required: false },
  idCreator: { type: String, required: false },
  createAt: { type: Date, default: Date.now() },
  participants: [
    {
      socketID: { type: String, default: "" },
      peerID: { type: String, default: "" },
      username: String,
      nameDisplay: String,
      isOnline: { type: Boolean, default: false }, // set user offline when user out meeting
      isTeacher: { type: Boolean, default: false },
      isTeachAssitant: { type: Boolean, default: false },
    },
  ],
  conversation: [
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

module.exports = mongoose.model("meeting", meetingSchema);
