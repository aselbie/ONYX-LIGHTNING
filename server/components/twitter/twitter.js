var Twit = require('twit');
var keyword = require'keyword-extract');

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


function parseHeadline(article) {
  headline = article.title;
  summary = article.info;
  tweetWords = [];

  // find three most mentioned keywords in summary
  keywords.extract('en', headline, function(words){
    //words = array of keywords from headline

    // create object to track each mention of keyword in summary
    
  })

}

function streamTweets( ) {


}



module.exports = {
  fetchTweets: fetchTweets
  parseHeadline: parseHeadline
}