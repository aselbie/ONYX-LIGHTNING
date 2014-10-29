'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NewsSchema = new Schema({
  title: String,
  info: String,
  location: Array,
  votes: Number,
  sentiment: Object,
  url: {
    type: String,
    unique: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('News', NewsSchema);
