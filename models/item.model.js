const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  collectionName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  tags: {
    type: Array,
    required: true
  },
  likes: {
    type: Array
  },
  comments: {
    type: Array
  }
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;