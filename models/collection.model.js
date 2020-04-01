const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  owner: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  topic: {
    type: String,
    required: true
  },
  items: {
    type: Number
  }

}, {
  timestamps: true,
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;