;(function(){
  'use strict';


  angular
    .module('onyxLightningApp')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', 'MainFactory', '$stateParams', '$state'];

  function MainCtrl($scope, MainFactory, $stateParams, $state) {
    $scope.index = $stateParams.index || 0;
    $state.go('main.article');
    $scope.expandedSwitch = false;
    $scope.news = $scope.news || [];
    setInterval(function(){
      MainFactory.get().
        success(function(data, status, headers, config) {
          var scopeLength = $scope.news.length;
          for (var i = 0; i < data.length; i ++) {
            if (!$scope.news[i]) {
              $scope.news.push(data[i]);
            }
          }
          if ($scope.news.length !== scopeLength) {
            $scope.news.sort(function(a, b) {
              return b.votes - a.votes;
            })            
          };

        }).
        error(function(data, status, headers, config) {
          // console.log(data);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });      
    }, 10000);
  }
  
}).call(this);
