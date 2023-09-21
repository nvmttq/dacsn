const mongoose = require('mongoose');

const examinationSchema = new mongoose.Schema({
  testScore: { type: Number, required: false },
  time: { type: Date, required: false },
  dateTest: { type: Date, required: false },
  numberOfSubmissions: { type: Number, required: false },
  idClassroom: { type: String, required: false }
});

module.exports = mongoose.model('examination', examinationSchema);