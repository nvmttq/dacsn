const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true},
  password: { type: String, required: true},
  email: { type: String, default: ''},
  permissions: { type: Array, default: []}
});

module.exports = mongoose.model('account', accountSchema);
