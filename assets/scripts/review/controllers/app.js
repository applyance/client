'use strict';

module.exports = angular.module('Review')
  .controller('AppCtrl', ['$scope', '$rootScope', '$location', 'Store',
    function ($scope, $rootScope, $location, Store) {

      $scope.AppState = {
        newQuestion: false
      };

      $scope.toggleCreateQuestionDialog = function(toggleValue) {
        $scope.AppState.newQuestion = toggleValue || !$scope.AppState.newQuestion;
      };

      $scope.activeEntityId = function() {
        return Store.getActiveEntityId();
      };

      $scope.activeEntity = function() {
        return Store.getActiveEntity();
      };

      $scope.isActive = function(route) {
        return route === $location.path();
      };

      $scope.isAdmin = function() {
        return Store.getCurrentScope() == "admin";
      };

      // Update the active entity context on route change
      $rootScope.$on("$routeChangeSuccess", function(args) {

        var pathParts = $location.path().split("/");

        if (pathParts[1] == "entities") {
          var entityId = pathParts[2];
          if (entityId) {
            Store.setActiveEntityId(entityId);
          }
        }

        $rootScope.inSettings = false;
      });

    }]);