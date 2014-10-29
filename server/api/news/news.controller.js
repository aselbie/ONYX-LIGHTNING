/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';
var newsAggregator = require('./../../components/news_aggregator/news.aggregator.js');
var _ = require('lodash');
var News = require('./news.model.js');

module.exports = {
  createArticle: createArticle,
  saveArticle: saveArticle,
  index: index,
  show: show,
  destroy: destroy,
  destroyAll: destroyAll
};

// Fill Database with Yahoo data
newsAggregator.fetchArticles(createArticle);

setInterval(function(){

  destroyAll(function(){

    newsAggregator.fetchArticles(createArticle);
    console.log("### New Articles Fetched");

  });
  // saveArticle();
}, 1800000);
  
// ############ Functions: ###################

// Create Unique article in DB (uniqueness is determined by the url)
// This function is meant to be a callback for fetchArticles() in parseRSS.js
function createArticle(newArticle) {
  News.create(newArticle, function(err, article){
    if (err) {
      // console.log(err)
      ;
    } else {
      // console.log(newArticle);
      ;
    }
  });
};

function upvote(req, res){
  News.findOne(req.params.id, function(err, article) {
    article.votes++;
    article.save();
  })
}

function downvote(req, res){
  News.findOne(req.params.id, function(err, article){
    article.votes--;
    article.save();
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


// Deletes a thing from the DB.
function destroy(req, res) {
  News.findById(req.params.id, function (err, news) {
    if(err) { return handleError(res, err); }
    if(!news) { return res.send(404); }
    news.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
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
