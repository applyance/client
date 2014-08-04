'use strict';

module.exports = angular.module('Register')
  .controller('FormCtrl', ['$scope', '$http', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, ApplyanceAPI, $timeout) {

      $scope.form = {
        step: 1,
        submitted: false,
        submittable: false,
        reviewer: {
          name: "",
          email: "",
          password: ""
        },
        entity: {
          name: ""
        }
      };

      $scope.isSubmittable = function() {
        $scope.form.submittable = true;
        if (
          $scope.form.reviewer.name.length == 0
          || $scope.form.reviewer.email.length == 0
          || $scope.form.reviewer.password.length == 0) {
            $scope.form.submittable = false;
        }
        if ($scope.form.entity.name.length == 0) {
          $scope.form.submittable = false;
        }
      };

      $scope.$watch('form.reviewer', $scope.isSubmittable, true);
      $scope.$watch('form.entity', $scope.isSubmittable, true);

      $scope.definitions = [];
      ApplyanceAPI.getDefinitions().then(function(definitions) {
        $scope.definitions = definitions;
      });

      $scope.blueprints = [];

      $scope.getBlueprintFromDefinition = function(definition) {
        return _.find($scope.blueprints, function(blueprint) {
          return blueprint.definition_id == definition.id;
        });
      };

      $scope.isSet = function(definition) {
        return !!$scope.getBlueprintFromDefinition(definition);
      };

      $scope.toggle = function(definition) {
        var blueprint = $scope.getBlueprintFromDefinition(definition);
        if (blueprint) {
          $scope.blueprints.splice($scope.blueprints.indexOf(blueprint), 1);
        } else {
          $scope.blueprints.push({
            definition_id: definition.id,
            position: 1,
            is_required: true
          });
        }
      };

      $scope.clickChoose = function() {
        $timeout(function() {
          var logo = $('#logo');
          var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
          logo[0].dispatchEvent(event);
        }, 100);
      };

      $scope.submit = function() {
        $scope.form.submitting = true;
        if ($scope.form.entity.fileObj) {
          ApplyanceAPI.uploadAttachment(
            $scope.form.entity.fileObj,
            $scope.form.entity.fileObj.type
          ).then($scope.onAttachmentUpload);
        } else {
          $scope.createEntity();
        }
      }

      $scope.onAttachmentUpload = function(attachment) {
        $scope.form.entity.logo = {
          name: $scope.form.entity.fileObj.name,
          token: attachment.data.token
        };
        $scope.createEntity();
      };

      $scope.onLoggedIn = function() {
        $scope.form.submitted = true;
      };

      $scope.onCreateBlueprints = function(blueprints) {
        $http.post('/accounts/login/headless', {
          email: $scope.form.reviewer.email,
          password: $scope.form.reviewer.password
        }).then($scope.onLoggedIn);
      };

      $scope.onAuthenticate = function(data, status, headers, config) {
        var api_key = headers('authorization').split('auth=')[1];

        // Mass create blueprints
        $http.post(ApplyanceAPI.getApiHost() + "/entities/" + $scope.entity.id + "/blueprints", {
          blueprints: $scope.blueprints
        }, {
          headers: { 'Authorization': 'ApplyanceLogin auth=' + api_key }
        }).then($scope.onCreateBlueprints);
      };

      $scope.onCreateReviewer = function(reviewer) {
        $scope.reviewer = reviewer;

        // Authenticate
        ApplyanceAPI.authenticate({
          email: $scope.form.reviewer.email,
          password: $scope.form.reviewer.password
        }).success($scope.onAuthenticate);
      };

      $scope.onCreateEntity = function(entity) {
        $scope.entity = entity;
        ApplyanceAPI.postReviewer(entity.id, $scope.form.reviewer).then($scope.onCreateReviewer);
      };

      $scope.createEntity = function() {
        ApplyanceAPI.postNewEntity($scope.form.entity).then($scope.onCreateEntity);
      };

    }]);
