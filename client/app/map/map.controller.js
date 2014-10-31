
;(function(){
  'use strict';


  angular
    .module('onyxLightningApp')
    .controller('MapCtrl', MapCtrl);

  MapCtrl.$inject = ['$scope', 'MapFactory'];

  function MapCtrl($scope, MapFactory) {
    $scope.zoomToCountry = MapFactory.zoomToCountry;
    $scope.highlightTweets = MapFactory.highlightTweets;
  }
}).call(this);
