module.exports = {
  destroyLowScores: destroyLowScores,
  calculateScore: calculateScore
}

var _ = require('lodash');
var News = require('./../../api/news/news.model.js');

function destroyLowScores(articles, callback){
  var count = 0;
  articles.sort( function(a,b){ return b.rank - a.rank; });
  _.forEach(articles, function(article){
    count++;
    if (count >= 20) {
      News.remove({_id: article._id}, function(){});
    }
  });
  callback(null, articles);
}

function calculateScore(article, callback){
  var vote = article.votes;
  var date = new Date(article.date);
  var current = new Date;
  
  var timeDiff = Math.ceil(Math.abs(current.getTime() - date.getTime())/1000);

  var order = Math.max(Math.log(Math.abs(vote)));
  var sign = vote > 0 ? 1 : vote < 0 ? -1 : 0;
  var articleScore = Math.round((order + sign * timeDiff / 45000) * 10)
  article.rank = article.rank + articleScore;
  callback(article);
}