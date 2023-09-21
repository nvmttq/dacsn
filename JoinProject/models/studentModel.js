const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: { type: String, required: false },
  lastName: { type: String, default: '' },
  firstName: { type: String, default: '' },
  enrollmentDate: { type: Date, default: '' }
});

module.exports = mongoose.model('student',studentSchema)
