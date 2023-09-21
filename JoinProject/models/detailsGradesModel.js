const mongoose = require('mongoose');



const gradeSchema = new mongoose.Schema({
  idUser: { type: String, required: false },
  idClassroom: { type: String, required: false },
  percent: { type: Number },
  courseTotal: { type: Number },
});

const detailsGradesSchema = new mongoose.Schema({
  id: { type: String, required: false },
  name: { type: String, required: false },
  description: { type: String, default: '' },
  score: { type: Number, required: false },
  idUser: { type: String, required: false },
  idClassroom: { type: String, required: false },
  grades: [gradeSchema]
});

module.exports = mongoose.model('detailsGrades', detailsGradesSchema);
