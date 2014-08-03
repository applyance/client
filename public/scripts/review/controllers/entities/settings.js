'use strict';

module.exports = angular.module('Review')
  .controller('EntitySettingsCtrl', ['$scope', '$rootScope', 'flash', 'ApplyanceAPI', 'Store', '$timeout',
    function ($scope, $rootScope, flash, ApplyanceAPI, Store, $timeout) {

      $scope.flash = flash;

      $scope.e = Store.getActiveEntity();

      if ($scope.e.location) {
        var a = $scope.e.address;
        $scope.address = a.address_1 + "\n" + a.city + ", " + a.state + " " + a.postal_code;
      }

      if ($scope.e.logo) {
        $scope.e.attachment = {
          url: $scope.e.logo.url
        };
      }

      $scope.hasAddressChanged = false;
      $scope.addressChange = function() {
        $scope.hasAddressChanged = true;
      }

      $scope.clickChoose = function() {
        $timeout(function() {
          var logo = document.querySelectorAll('#logo');
          var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
          logo[0].dispatchEvent(event);
        }, 100);
      }

      $scope.isUpdating = false;
      $scope.startUpdateEntity = function() {

        $scope.isUpdating = true;

        if (!$scope.e.fileObj) {
          $scope.updateEntity();
          return;
        }

        ApplyanceAPI.uploadAttachment($scope.e.fileObj,
          $scope.e.fileObj.type).then(
          function(r) {
            $scope.updateEntity({
              name: $scope.e.fileObj.name,
              token: r.data.token
            });
          },
          function(r) {
            console.log("failed to upload logo");
            console.log(r);
          }
        );

      };

      $scope.updateEntity = function(logo) {

        var entity = {
          id: $scope.e.id,
          name: $scope.e.name
        };

        if (logo) {
          entity.logo = logo;
        }

        if ($scope.hasAddressChanged) {
          entity.location = {
            address: $scope.address
          };
        }

        ApplyanceAPI.putEntity(entity).then(function(r) {
          $scope.isUpdating = false;

          Store.setEntity(r.data);

          $scope.flash.setMessage("Settings updated successfully.");
          $rootScope.$broadcast('flash');
        },
        function(r) {
          console.log("failed to update entity");
          console.log(r);
        });
      };

    }]);
