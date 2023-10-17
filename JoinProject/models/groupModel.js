const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  id: { type: String, required: false },
  title: { type: String, required: false },
  token: { type: String, default: "" },
  participants: [{
    idUser: { type: String, default: ""},
    isCreator: {type: Boolean, default: false}
  }],
});

module.exports = mongoose.model('group',groupSchema)