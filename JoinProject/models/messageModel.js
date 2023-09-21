const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  idMessage: { type: String, required: false },
  idSender: { type: String, required: false },
  idRecipient: { type: String, required: false },
  content: { type: String, required: false },
  dateSent: { type: Date, required: false }
});



module.exports = mongoose.model('message',messageSchema)
