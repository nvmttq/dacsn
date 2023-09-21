const mongoose = require('mongoose');



const commentSchema = new mongoose.Schema({
    idComment: { type: String },
    idPost: { type: String, required: false },
    idUser: { type: String },
    title: { type: String, required: false },
    tags: [String],
    imagePath: { type: String, default: "" },
    content: { type: String, default: "" },
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() },
  
    reply: { type: Array, default: [] },
  });

const detailsPostSchema = new mongoose.Schema({
  idPost: { type: String, required: false },
  title: { type: String, required: false },
  tags: [String],
  imagePath: {type: String, default: ''},
  content: { type: String, default: '' },
  author: { type: String, required: true },
  datePosted: { type: Date, required: false },
  idCourse: { type: String, required: false },
  comments: [commentSchema],
});



module.exports = mongoose.model('detailsPost', detailsPostSchema)
