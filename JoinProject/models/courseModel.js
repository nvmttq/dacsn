const mongoose = require('mongoose');

const contentCourseSchema = new mongoose.Schema({
  key: { type: String},
  label: { type: String},
  data: { type: String, default: ''},
  icon: { type: String, default: ''},
  children: { type: Array, default: []}
});

const courseSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  token: { type: String, default: ''},
  imagePath: { type: string, dafult: ''},
  assignment: { type: Number, default: 0},
  countDownTime: { type: Date},
  contentCourses: [contentCourseSchema],
  participants: { type: Array, default: []}
});

module.exports = mongoose.model('course', courseSchema);
