;(function(){
  'use strict';


  angular
    .module('onyxLightningApp')
    .controller('ArticleCtrl', ArticleCtrl);

  ArticleCtrl.$inject = ['$scope', '$stateParams', '$http'];

  function ArticleCtrl($scope, $stateParams, $http) {
    $scope.index = $stateParams.index || 0;
    
    $scope.upvote = function(){
      $http.put('/api/news/upvote/' + $scope.news[$scope.index]._id).success(function(data){
        $scope.news[$scope.index].votes = data.votes;
        $scope.news[$scope.index].rank = data.rank;
        $scope.news.sort(function(a, b) { return b.rank - a.rank});
      });
    }
    
    $scope.downvote = function(){
      $http.put('/api/news/downvote/' + $scope.news[$scope.index]._id).success(function(data){
        $scope.news[$scope.index].votes = data.votes;
        $scope.news[$scope.index].rank = data.rank;
        $scope.news.sort(function(a, b) { return b.rank - a.rank});
      });      
    }
  }

}).call(this);
