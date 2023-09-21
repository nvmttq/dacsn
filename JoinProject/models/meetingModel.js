const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  idMeeting: { type: String, required: false },
  meetingName: { type: String, required: false },
  dateAndTime: { type: Date, required: false },
  description: { type: String, default: '' },
  idClass: { type: String, required: false },
  idCreator: { type: String, required: false }
});

module.exports = mongoose.model('meeting',meetingSchema)
