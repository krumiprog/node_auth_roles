const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  value: {
    type: String,
    unique: true,
    default: 'user',
  },
});

module.exports = mongoose.model('Role', roleSchema);
