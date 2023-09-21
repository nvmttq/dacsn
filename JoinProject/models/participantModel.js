const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  idMeeting: { type: String, required: false },
  id: { type: String, required: false }
});



module.exports = mongoose.model('participant',participantSchema)
