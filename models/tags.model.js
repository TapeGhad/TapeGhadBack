const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2
  }
});

const Tags = mongoose.model('Tags', tagsSchema);

module.exports = Tags;