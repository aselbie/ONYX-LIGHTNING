var FeedParser = require('feedparser');
var request = require('request');
var apiMap = require('./news.source.config.js');
var utils = require('./news.aggregator.utils.js');
var sentiment = require('sentiment');

exports.fetchArticles = function(dbCallback) {

  for (var key in apiMap) {
    console.log(key);
    fetchSingleApi(apiMap[key]);
  }

  function fetchSingleApi (api) {
    var req = request(api.url);
    var feedparser = new FeedParser();

    req.on('error', function (error) {
      if (error) {
        console.log(error);
      }
    });
    
    req.on('response', function (res) {
      var stream = this;

      if (res.statusCode != 200) {
        return this.emit('error', new Error('Bad status code'));
      }

      stream.pipe(feedparser);
    });


    feedparser.on('error', function(error) {
      // always handle errors
      if (error) {
        console.log(error);
      }
    });
    
    feedparser.on('readable', function() {
      // This is where the action is!
      var stream = this; 
      // **NOTE** the "meta" is always available in the context of the feedparser instance
      var meta = this.meta; 
      var item;

      while (item = stream.read()) {
        var newItem = {};
        newItem.title = item.title;
        newItem.location = utils.getLocation(item.summary);
        newItem.info = item.summary;
        newItem.votes = 0;
        newItem.url = item.link;
        newItem.sentiment = sentiment(newItem.info).score+"";
        dbCallback(newItem);
      }
    });
  }

};
