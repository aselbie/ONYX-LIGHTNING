/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';
var Bluebird = require('bluebird');
var newsAggregator = require('./../../components/news_aggregator/news.aggregator.js');
var ranking = require('./../../components/ranking/ranking.js');
var _ = require('lodash');
var News = require('./news.model.js');

module.exports = {
  upvote: upvote,
  downvote: downvote,
  index: index,
  show: show,
  destroyAll: destroyAll
};

var fetchArticles = Bluebird.promisify(newsAggregator.fetchArticles);
var destroyLowScores = Bluebird.promisify(ranking.destroyLowScores);

(function refresh() {
  // destroyAll(function(){console.log('done')});
  // Grab articles from APIs (Currently only Yahoo is implemented)
  fetchArticles(null, function(){

    // Grab all current news articles from DB
    News.find({}, function(err, articles){

      // Remove least relevant articles from the database
      destroyLowScores(articles)
      .then(function(articles) {
        console.log('articles.length: %s', articles.length);
      })
      
    })
  });
  setTimeout(refresh, 100000);
})(); // IIFE Baby!

// ############ Functions: ###################

function upvote(req, res){
  News.findOne({_id: req.params.id}, function(err, article) {
    article.votes++;
    
    ranking.calculateScore(article, function(newArticle){
      newArticle.save(function(err){
        if (err){ return handleError(res, err); }
        return res.json({votes:article.votes, rank:article.rank});
      });      
    });
  })
}

function downvote(req, res){
  News.findOne({_id: req.params.id}, function(err, article){
    article.votes--;
    
    ranking.calculateScore(article, function(newArticle){
      newArticle.save(function(err){
        if (err){ return handleError(res, err); }
        return res.json({votes:article.votes, rank: article.rank});
      });      
    });
  })
}

// Get list of things
function index(req, res) {
  News.find(function (err, news) {
    if(err) { return handleError(res, err); }
    return res.json(200, news);
  });
};

// Get a single thing
function show(req, res) {
  News.findById(req.params.id, function (err, news) {
    if(err) { return handleError(res, err); }
    if(!news) { return res.send(404); }
    return res.json(news);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function destroyAll(callback){
  News.find(function(err, news){
    _.forEach(news, function(newsItem){
      newsItem.remove();
    })
    callback();
  });
}
