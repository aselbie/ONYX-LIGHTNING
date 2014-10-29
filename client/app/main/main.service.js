;(function(){
  'use strict';

  angular
    .module('onyxLightningApp')
    .factory('MainFactory', MainFactory);

  MainFactory.$inject = ['$http'];
  function MainFactory($http) {

    var instance = {
      get:get,
      put:put
    }
    return instance;

    ////////////////////

    function get(){
      return $http.get('/api/news');
    }
    function put(){
      $http.put('/api/news/upvote');
    }
  }

}).call(this);
