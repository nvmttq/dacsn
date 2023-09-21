const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  id: { type: String, required: false },
  name: { type: String, required: false },
  author: { type: String, required: false },
  isPublic: { type: Boolean, required: false },
  idConversation: { type: String, required: false }
});

module.exports = mongoose.model('group',groupSchema)
