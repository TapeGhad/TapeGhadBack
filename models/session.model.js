const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  }
}, {
  timestamps: true,
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;