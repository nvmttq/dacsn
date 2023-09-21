const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  id: { type: Number, required: false },
  name: { type: String, required: false }
});

module.exports = mongoose.model('role',roleSchema)
