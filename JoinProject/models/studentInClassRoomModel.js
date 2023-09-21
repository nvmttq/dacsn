const mongoose = require('mongoose');

const studentInClassroomSchema = new mongoose.Schema({
  idClassRoom: { type: String, required: false },
  idStudent: { type: String, required: false }
});

module.exports = mongoose.model('studentInClassroom',studentInClassroomSchema)
