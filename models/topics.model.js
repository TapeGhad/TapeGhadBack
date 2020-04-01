const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const topicsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2
  }
});

const Topics = mongoose.model('Topics', topicsSchema);

module.exports = Topics;