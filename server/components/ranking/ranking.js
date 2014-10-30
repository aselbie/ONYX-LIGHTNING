module.exports = {
  destroyLowScores: destroyLowScores
}

var _ = require('lodash');
var News = require('./../../api/news/news.model.js');

function destroyLowScores(articles, callback){
  var count = 0;
  articles.sort( function(a,b){ return b.votes - a.votes; });
  _.forEach(articles, function(article){
    count++;
    if (count >= 20) {
      News.remove({_id: article._id}, function(){});
    }
  });
  callback(null, articles);
}