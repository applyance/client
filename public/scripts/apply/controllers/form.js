'use strict';

module.exports = angular.module('Apply')
  .controller('FormCtrl', ['$scope', '$http', 'entity', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, entity, ApplyanceAPI, $timeout) {

      $scope.entity = entity;

      $scope.applicant = {
        name: "",
        email: "",
        password: null,
        phone_number: "",
        location: {
          address: ""
        },
        datums: []
      };

      $scope.blueprints = [];
      ApplyanceAPI.getBlueprints($scope.entity.id).then(function(blueprints) {
        $scope.blueprints = $scope.blueprints.concat(blueprints.plain());
      });

      if ($scope.entity.parent) {
        ApplyanceAPI.getBlueprints($scope.entity.parent.id).then(function(blueprints) {
          $scope.blueprints = $scope.blueprints.concat(blueprints.plain());
        });
      }

      $scope.$watch('blueprints', function() {
        $scope.checkForReadyToSubmit();
      }, true);

      $scope.$watch('applicant', function() {
        $scope.checkForReadyToSubmit();
      }, true);

      $scope.resetEmail = function() {
        $scope.emailNote = 'check';
        $scope.passwordNote = 'check';
        $scope.readyForBlueprints = false;
        $scope.readyToSubmit = false;
        $scope.promptPassword = false;
      }
      $scope.resetEmail();

      $scope.checkEmail = function() {
        if (!$scope.applicant.email) {
          $scope.resetEmail();
          return;
        }
        $scope.emailNote = 'loading';
        ApplyanceAPI
          .checkForEmail($scope.applicant.email)
          .success($scope.emailFound)
          .error($scope.emailNotFound);
      };

      $scope.emailFound = function() {
        $scope.promptPassword = true;
        $scope.readyForBlueprints = false;
        $scope.emailNote = 'found';
      };

      $scope.emailNotFound = function() {
        $scope.promptPassword = false;
        $scope.readyForBlueprints = true;
        $scope.checkForReadyToSubmit();
        $scope.emailNote = 'notFound';
      };

      $scope.skipPassword = function() {
        $scope.readyForBlueprints = true;
        $scope.checkForReadyToSubmit();
        $scope.promptPassword = false;
        $timeout(function() {
          $scope.$broadcast('nameFocus');
        });
      }

      $scope.authenticate = function() {
        $scope.readyForBlueprints = false;
        $scope.passwordNote = 'loading';

        ApplyanceAPI.authenticate({
            email: $scope.applicant.email,
            password: $scope.applicant.password
          })
          .success($scope.onAuthenticateSuccess)
          .error(function() {
            $scope.passwordNotFound();
          });
      };

      $scope.onAuthenticateSuccess = function(me, status, headers, config) {
        $scope.mapMeToApplicant(me);
        if (me.applicant) {
          var api_key = headers('authorization').split('auth=')[1];
          $http.get(ApplyanceAPI.getApiHost() + "/applicants/" + $scope.applicant.id + "/datums", {
            headers: { 'Authorization': 'ApplyanceLogin auth=' + api_key }
          }).then($scope.onDatumsLoad);
        } else {
          $scope.passwordNotFound();
        }
      };

      $scope.mapMeToApplicant = function(me) {
        $scope.applicant.id = me.applicant.id;
        $scope.applicant.name = me.account.name;
        if (me.applicant && me.applicant.phone_number) {
          $scope.applicant.phone_number = me.applicant.phone_number;
        }
        if (me.applicant && me.applicant.location) {
          var a = me.applicant.location.address;
          $scope.applicant.location.address = a.address_1 + "\n" + a.city + ", " + a.state + " " + a.postal_code;
        }
      }

      $scope.onDatumsLoad = function(datums) {
        _.each($scope.blueprints, function(blueprint) {
          var thisDatum = _.find(datums.data, function(datum) {
            return datum.definition.id == blueprint.definition.id;
          });
          if (thisDatum) {
            blueprint.detail = thisDatum.detail;
          }
        });
        $scope.passwordNote = 'found';
        $scope.readyForBlueprints = true;
        $scope.checkForReadyToSubmit();
      }

      $scope.passwordNotFound = function() {
        $scope.passwordNote = 'notFound';
        $scope.readyForBlueprints = true;
        $scope.checkForReadyToSubmit();
      }

      $scope.checkForReadyToSubmit = function() {
        $scope.readyToSubmit = true;
        if (
               ($scope.applicant.name.length == 0)
            || ($scope.applicant.phone_number.length == 0)
            || ($scope.applicant.location.address.length == 0)) {
          $scope.readyToSubmit = false;
          return;
        }
        if ($scope.blueprints.length > 0) {
          var isComplete = true;
          _.each($scope.blueprints, function(blueprint) {
            if (!blueprint.detail || (blueprint.detail.value.length == 0)) {
              isComplete = false;
            }
          });
          $scope.readyToSubmit = isComplete;
        }
      }

      $scope.onSubmit = function() {
        var fields = [];
        _.each($scope.blueprints, function(blueprint) {
          if (!blueprint.detail) {
            return;
          }
          fields.push({
            datum: {
              definition_id: blueprint.definition.id,
              detail: blueprint.detail
            }
          });
        });

        var entity_ids = [];
        entity_ids.push($scope.entity.id);

        var application = {
          applicant: $scope.applicant,
          entity_ids: entity_ids,
          fields: fields
        };

        ApplyanceAPI.postApplication(application).then(function(application) {
          console.dir(application);
        });

      }

    }]);
