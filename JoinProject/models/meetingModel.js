const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  idMeeting: { type: String, required: false },
  title: { type: String, required: false },
  idCourse: { type: String, required: false },
  idCreator: { type: String, required: false },
  createAt: {type: Date, default: Date.now()},
  participants: [
    {
      socketId: { type: String, default: "" },
      peerId: { type: String, default: "" },
      username: String,
      nameDisplay: String,
      isOnline: {type: Boolean, default: false},
      isTeacher: { type: Boolean, default: false },
      isTeachAssitant: { type: Boolean, default: false },
    },
  ],
  idConversation: { type: String, default: "" },
});

module.exports = mongoose.model("meeting", meetingSchema);
