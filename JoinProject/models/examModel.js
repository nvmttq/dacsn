const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  id: { type: String, required: false },
  subject: { type: String, required: false }
});

module.exports = mongoose.model('exam', examSchema);