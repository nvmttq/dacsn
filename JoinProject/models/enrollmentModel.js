const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: false },
  studentID: { type: String, required: false },
  grade: { type: String, default: '' }
});

module.exports = mongoose.model('enrollment', enrollmentSchema);