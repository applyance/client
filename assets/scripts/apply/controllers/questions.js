'use strict';

module.exports = angular.module('Apply')
  .controller('QuestionsCtrl', ['$scope', 'ApplyanceAPI',
    function ($scope, ApplyanceAPI) {

      $scope.onBlueprintsGet = function(blueprints) {
        _.each(blueprints, function(blueprint, index) {
          blueprint._valid = false;
          $scope.blueprints.push(blueprint);
        });
        $scope.blueprints.sort(function(b1, b2) {
          if (b1.position < b2.position) { return -1; }
          if (b1.position > b2.position) { return 1; }
          return 0;
        });
        _.each($scope.blueprints, function(blueprint, index) {
          blueprint._index = index;
        });
      };

      $scope.removeBlueprints = function(cb) {
        var blueprintToRemove = _.find($scope.blueprints, cb);
        var index = _.indexOf($scope.blueprints, blueprintToRemove);
        if (index > -1) {
          $scope.blueprints.splice(index, 1);
        }
      };

      //
      // Get the first blueprints for entity and its parent
      //

      ApplyanceAPI.getBlueprints($scope.entity.id).then($scope.onBlueprintsGet);
      if ($scope.entity.parent) {
        ApplyanceAPI.getBlueprints($scope.entity.parent.id).then($scope.onBlueprintsGet);
      }

      //
      // Add hooks for new locations
      //

      $scope.$on('location.added', function(evt, location) {
        ApplyanceAPI.getBlueprints(location.id).then($scope.onBlueprintsGet);
      });

      $scope.$on('location.removed', function(evt, location) {
        $scope.removeBlueprints(function(blueprint) {
          if (!blueprint.entity) {
            return false;
          }
          return blueprint.entity.id == location.id;
        });
      });

      //
      // Add hooks for new spots
      //

      $scope.$on('spot.added', function(evt, spot) {
        ApplyanceAPI.getSpotBlueprints(spot.id).then($scope.onBlueprintsGet);
      });

      $scope.$on('spot.removed', function(evt, spot) {
        $scope.removeBlueprints(function(blueprint) {
          if (!blueprint.spot) {
            return false;
          }
          return blueprint.spot.id == spot.id;
        });
      });

      $scope.isDisabled = function() {
        return $scope.form.sequence < 3;
      };

    }
  ]);
