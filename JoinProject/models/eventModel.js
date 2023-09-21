const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  idEvent: { type: String, required: false },
  eventName: { type: String, required: false },
  startTime: { type: Date, required: false },
  endTime: { type: Date, required: false },
  address: { type: String, required: false },
  description: { type: String, default: '' },
  idCreator: { type: String, required: false }
});

module.exports = mongoose.model('event', eventSchema);