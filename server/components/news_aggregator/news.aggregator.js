var FeedParser = require('feedparser');
var request = require('request');
var apiMap = require('./news.source.config.js');
var utils = require('./news.aggregator.utils.js');
var sentiment = require('sentiment');
var News = require('./../../api/news/news.model.js');

exports.fetchArticles = function(data, callback) {
  var startRank;
  
  News.find(function(err, news){
    news.sort(function(a, b) {return b.rank - a.rank});  
    if (news[2]){
      startRank = news[2].rank;      
    } else {
      startRank = 0;
    }

    for (var key in apiMap) {
      console.log(key);
      fetchSingleApi(apiMap[key], callback);
    }
  });
  
  function fetchSingleApi (api, callback) {
    var req = request(api.url);
    var feedparser = new FeedParser();

    req.on('error', function (error) {
      if (error) {
        // console.log(error);
      }
    });
    req.on('response', function (res) {
      var stream = this;

      if (res.statusCode !== 200) {
        return this.emit('error', new Error('Bad status code'));
      }

      stream.pipe(feedparser);
    });


    feedparser.on('error', function(error) {
      // always handle errors
      if (error) {
        console.log(error, 'parser error');
      }
    });
    
    feedparser.on('readable', function() {
      // This is where the action is!
      var stream = this;
      // **NOTE** the "meta" is always available in the context of the feedparser instance
      var meta = this.meta;
      var item;

      while (item === stream.read()) {
        var newItem = {};
        newItem.title = item.title;
        newItem.location = utils.getLocation(item.summary);
        newItem.info = item.summary;
<<<<<<< HEAD
        newItem.votes = 0;
        newItem.rank = startRank;
=======
>>>>>>> fixing news aggregator merge conflict
        newItem.url = item.link;
        newItem.sentiment = sentiment(newItem.info).score+"";

        newItem.tweets = [
          {
            latitude: 44.968046,
            longitude: -94.420307
          },
          {
            latitude: 33.755787,
            longitude: -116.359998
          },
          {
            latitude: 44.92057,
            longitude: -93.44786
          }
        ];

        // Create Unique article in DB (uniqueness is determined by the url)
        // This function is meant to be a callback for fetchArticles() in parseRSS.js
        News.create(newItem, function(){});
      }

    });

    feedparser.on('end', function() {
      callback(null);
    });
  }

};
