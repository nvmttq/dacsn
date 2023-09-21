const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  idPost: { type: String, required: false },
  title: { type: String, required: false },
  tags: [String],
  imagePath: {type: String, default: ''},
  content: { type: String, default: '' },
  author: { type: String, required: true },
  datePosted: { type: Date, required: false },
  idCourse: { type: String, required: false }
});



module.exports = mongoose.model('post', postSchema)
