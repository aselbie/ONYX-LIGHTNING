;(function(){
  'use strict';

  angular
    .module('onyxLightningApp')
    .factory('MainFactory', MainFactory);

  MainFactory.$inject = ['$http'];
  function MainFactory($http) {

    var instance = {
      get:get,
    }
    return instance;

    ////////////////////

    function get(){
      return $http.get('/api/news');
    }
  }

}).call(this);
