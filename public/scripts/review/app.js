'use strict';

// Vendor Libs
window.CryptoJS     = require("crypto-js");
window.moment       = require("moment");
window.MediumEditor = require("medium-editor");
window.Tether       = require("tether");

var attachFastClick = require('fastclick');
attachFastClick(document.body);

require("angular");
require("angular-route");
require("angular-moment");
require("angular-medium-editor");
require('./../ext/angular-payments/lib/angular-payments.js');

// Define Review Module
angular.module('Review', [require("../services/api").name, 'ngRoute', 'angularMoment', 'angular-medium-editor', 'angularPayments'])
  .run(['$rootScope', function($rootScope) {
    $rootScope.menuStates = { 'main': false, 'account': false, 'context': false, 'settings': false };
    $rootScope.closeResponsiveMenus = function() {
      _.each($rootScope.menuStates, function(menu, key) {
        $rootScope.menuStates[key] = false;
      });
    };
    $rootScope.toggleResponsiveMenu = function(menu) {
      var target = !$rootScope.menuStates[menu];
      $rootScope.closeResponsiveMenus();
      $rootScope.menuStates[menu] = target;
    };
    $rootScope.$on("$routeChangeSuccess", function(args) {
      $rootScope.closeResponsiveMenus();
    });
  }])
  .config(['$routeProvider', '$locationProvider', 'me', require("./routes")]);

require("../directives");
require("../filters");
require("./directives/directives");

require("./services/store");
require("./services/flash");

require("./controllers/header/header");
require("./controllers/header/account");

require("./controllers/applications");
require("./controllers/settings");
require("./controllers/account");

require("./controllers/application/application");
require("./controllers/application/profile");
require("./controllers/application/sidebar");

require("./controllers/entities/blueprints");
require("./controllers/entities/entities");
require("./controllers/entities/reviewers");
require("./controllers/entities/settings");
require("./controllers/entities/labels");
require("./controllers/entities/billing");

require("./controllers/spots/spots");
require("./controllers/spots/applications");
require("./controllers/spots/settings");
require("./controllers/spots/settings/settings");
require("./controllers/spots/settings/blueprints");
