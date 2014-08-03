'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationsCtrl', ['$scope', 'ApplyanceAPI', 'Store',
    function ($scope, ApplyanceAPI, Store) {

      ApplyanceAPI.getApplications(Store.activeEntityId).then(function(applications) {
         $scope.applications = applications;
      });

      $scope.activeEntity = Store.getActiveEntity();

      $scope.getAvatarUrl = function(application) {
        if (application.applicant.account.avatar) {
          return application.applicant.account.avatar.url;
        }
        return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(application.applicant.account.email) + '?d=mm';
      };

      $scope.getRating = function(application) {
        var cumulative = 0.0;
        _.each(application.ratings, function(rating) {
          cumulative += rating.rating;
        });
        cumulative = cumulative / application.ratings.length;
        return Math.round(cumulative);
      };

      $scope.isRatingSet = function(i, application) {
        return (i <= $scope.getRating(application));
      }

    }]);
