'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NewsSchema = new Schema({
  title: String,
  info: String,
  location: Array,
  votes: Number,
  rank: Number,
  sentiment: Object,
  url: {
    type: String,
    unique: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  tweets: [
    {
      latitude: Number,
      longitude: Number
    }
  ]
});

module.exports = mongoose.model('News', NewsSchema);
