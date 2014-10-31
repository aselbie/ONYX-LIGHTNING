var Twit = require('twit');
var extractor = require('keyword-extractor');
var _ = require('lodash');

var secrets = {
  consumerKey: 'r9BZJCi6pJG2o2vILW9E6eXNK',
  consumerSecret: 'GrkxfudvizNt9z7B1jWgtgOtbWX7NIGbp27YQ3EDef4BXeici8',
  accessToken: '2724611467-4ZAZMQTnMUZrTFZx5h3zc5sPuCx6LuJZZiujRoo',
  accessTokenSecret: '3MtFdETm1HBGmzl8YC9DWeuDoraudnx0lWDgFAr2g7gt2'
}

var T = new Twit({
  consumer_key: secrets.consumerKey,
  consumer_secret: secrets.consumerSecret,
  access_token: secrets.accessToken,
  access_token_secret: secrets.accessTokenSecret
});

// Returns an array with the three most relevant words from the headline
function parseHeadline(article) {
  headline = article.title;
  summary = article.info.split(' ');

  // Ensure that location will be included in tweet watch terms
  tweetWords = [article.location];

  // Extract keywords from headline
  var extractedWords = extractor.extract(headline, { language:"english", return_changed_case:true });

  // Create object to track each mention of keyword in summary
  var keywords = {};
  _.map(extractedWords, function(word){ keywords[word] = 0; });

  // Iterate over summary to count mentions of each keyword
  for ( var i = 0; i< summary.length; i++ ) {
    for (var word in keywords) {
      if (word === summary[i]){
        keywords[word] += 1;
      }
    }
  }

  // Sort keywords by highest number of mentions
  sortedKeys = Object.keys(keywords).sort(function(a,b){return keywords[a] - keywords[b];});

  // Push last two into tweetWords array and don't judge me for doing it this way
  tweetWords.push(sortedKeys.pop());
  tweetWords.push(sortedKeys.pop());
  //tweetWords.push(sortedKeys.pop()); // or three, if you're feeling fancy

  return tweetWords;
}

function streamTweets(article) {
  var tweetWords = parseHeadline(article);
  console.log('TWEETWORDS', tweetWords);

  var stream = T.stream('statuses/filter', { track: tweetWords });

  stream.on('tweet', function (tweet) {

    // Create geodata object
    if (tweet.coordinates) {
      var geo = tweet.coordinates.coordinates;
      var tweetObj = {
        latitude: geo[1],
        longitude: geo[0]
      };

      // Save to database
      article.tweets.push(tweetObj);
      article.save();
      console.log('added to database', tweetObj);
    }

  });

// or search directly

  // T.get('search/tweets', { q: tweetWords, count: 100 }, function(err, data, response) {
  //   for (var i = 0; i < data.statuses.length; i++) {

  //     // Add to database
  //     if (data.statuses[i].coordinants) {
  //       var geo = data.statuses[i].coordinants.coordinants;
  //       var tweetObj = {
  //         latitude: geo[1],
  //         longitude: geo[0]
  //       };
  //       console.log(tweetObj);
  //     }

  //   };
  // })

}

module.exports = {
  parseHeadline: parseHeadline
}