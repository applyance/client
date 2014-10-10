module.exports = angular.module("Apply").run(["$templateCache", function($templateCache) {$templateCache.put("/views/apply/form.html","<ul class=\"form-sections\">\n  <li class=\"form-sections__item\"\n      ng-include=\"\'/views/apply/sections/locations.html\'\"\n      ng-show=\"counts.locations > 0\"></li>\n  <li class=\"form-sections__item\"\n      ng-include=\"\'/views/apply/sections/spots.html\'\"\n      ng-show=\"counts.spots > 0\"></li>\n  <li class=\"form-sections__item\"\n      ng-include=\"\'/views/apply/sections/questions.html\'\"></li>\n</li>\n");
$templateCache.put("/views/apply/header.html","<div class=\"apply-container\">\n  <div class=\"apply-entity\">\n    <img class=\"apply-entity__logo\" ng-if=\"entity.logo.url\" ng-src=\"{{ entity.logo ? entity.logo.url : null }}\" />\n    <div class=\"apply-entity__name\">\n      <div class=\"apply-entity__name__entity\">{{ entity.name }}</div>\n      <div class=\"apply-entity__name__preface\">Application Form</div>\n    </div>\n  </div>\n  <div class=\"apply-submit\">\n    <div class=\"apply-submit__progress\">\n      <ul class=\"apply-submit__progress__list\">\n        <li class=\"apply-submit__progress__list__item\"\n            ng-repeat=\"blueprint in blueprints\"\n            ng-class=\"{ \'is-complete\':(blueprint._valid && !blueprint._empty), \'is-required\':blueprint.is_required }\">\n          <span class=\"dot\"></span>\n        </li>\n      </ul>\n    </div>\n    <a href=\"\" class=\"btn is-round is-mini apply-submit__btn\"\n        ng-class=\"{ \'is-disabled\':(!form.valid || form.submitting) }\"\n        ng-disabled=\"!form.valid || form.submitting\"\n        ng-click=\"submit()\">\n      Submit\n    </a>\n  </div>\n</div>\n");
$templateCache.put("/views/apply/main.html","<div class=\"apply-submitted\" ng-include=\"\'/views/apply/submitted.html\'\"></div>\n<div class=\"apply-header\" ng-include=\"\'/views/apply/header.html\'\"></div>\n<div class=\"apply-form-container\">\n  <div class=\"apply-container\">\n    <div class=\"apply-form\"\n        ng-include=\"\'/views/apply/form.html\'\"\n        apl-shrink-header-on-reach></div>\n  </div>\n</div>\n");
$templateCache.put("/views/apply/sidebar.html","<ul class=\"apply-sidebar-items\">\n\n  <li class=\"apply-sidebar-items__item\">\n    <div class=\"apply-entity\">\n      <img class=\"apply-entity__logo\" ng-if=\"entity.logo.url\" ng-src=\"{{ entity.logo ? entity.logo.url : null }}\" />\n      <div class=\"apply-entity__name\">\n        <div class=\"apply-entity__name__entity\">{{ entity.name }}</div>\n        <div class=\"apply-entity__name__preface\">Application</div>\n      </div>\n    </div>\n  </li>\n\n  <li class=\"apply-sidebar-items__item\">\n    <ul class=\"apply-sections\">\n      <li class=\"apply-sections__item is-complete\">\n        <span class=\"apply-sections__item__progress\">\n          <svg class=\"icon\">\n            <use xlink:href=\"#checkmark-naked\" />\n          </svg>\n        </span>\n        <span class=\"apply-sections__item__label\">Select Locations</span>\n      </li>\n      <li class=\"apply-sections__item is-complete\">\n        <span class=\"apply-sections__item__progress\">\n          <svg class=\"icon\">\n            <use xlink:href=\"#checkmark-naked\" />\n          </svg>\n        </span>\n        <span class=\"apply-sections__item__label\">Select Spots</span>\n      </li>\n      <li class=\"apply-sections__item is-incomplete\">\n        <span class=\"apply-sections__item__progress\"></span>\n        <span class=\"apply-sections__item__label\">Answer Questions</span>\n      </li>\n    </ul>\n  </li>\n\n  <li class=\"apply-sidebar-items__item\" ng-if=\"questions.length > 0\">\n    <div class=\"apply-progress\">\n      <ul class=\"apply-progress__questions\">\n        <li class=\"apply-progress__questions__item\"\n            ng-repeat=\"question in questions\"\n            ng-class=\"{ \'is-complete\':question.is_complete }\"></li>\n      </ul>\n    </div>\n  </li>\n\n  <li class=\"apply-sidebar-items__item\">\n    <div class=\"al--center\">\n      <a href=\"\" ng-click=\"\" class=\"btn is-round is-small\">Send Application</a>\n    </div>\n  </li>\n\n</ul>\n");
$templateCache.put("/views/apply/submitted.html","<div class=\"apply-submitted__content\">\n  <div class=\"apply-submitted__logo\"\n      ng-if=\"form.submitted\">\n    <img ng-if=\"entity.logo.url\" ng-src=\"{{ entity.logo ? entity.logo.url : null }}\" />\n  </div>\n  <span class=\"apply-submitted__icon--loading\">\n    <svg>\n      <use xlink:href=\"#loader\" />\n    </svg>\n  </span>\n  <div ng-if=\"form.submitted\">\n    <div class=\"apply-submitted__title\">\n      Success!\n    </div>\n    <div class=\"apply-submitted__message\">\n      Your application has been sent to {{ entity.name }}.\n    </div>\n  </div>\n</div>\n");
$templateCache.put("/views/apply/sections/locations.html","<div class=\"form-section text-trim\"\n    ng-controller=\"LocationsCtrl\"\n    ng-class=\"{ \'is-disabled\':isDisabled() }\">\n  <div class=\"form-section__header\">\n    <div class=\"form-section__headline\">\n      Select Locations\n    </div>\n    <div class=\"form-section__subline\">\n      Select all locations that you are interested in applying.\n    </div>\n  </div>\n  <div class=\"form-section__content\">\n    <div class=\"apply-locations\">\n      <ul class=\"selection-list\">\n        <li class=\"selection-list__item\"\n            ng-repeat=\"location in locations\"\n            ng-class=\"{ \'is-selected\':location.is_selected }\">\n\n          <div class=\"apply-location selection-list__item__container\"\n              ng-click=\"toggleLocation(location)\">\n            <span class=\"selection-list__check\">\n              <span class=\"icon-wrap\">\n                <svg class=\"icon\">\n                  <use xlink:href=\"#checkmark-naked\" />\n                </svg>\n              </span>\n            </span>\n            <span class=\"apply-location__content\">\n              <div class=\"apply-location__name\">\n                {{ location.name }}\n              </div>\n              <div class=\"apply-location__address\"\n                  ng-if=\"false\"\n                  ng-bind-html=\"location.address\">\n              </div>\n            </span>\n          </div>\n\n        </li>\n      </ul>\n    </div>\n  </div>\n  <div class=\"form-section__tray al--center\">\n    <a href=\"\" class=\"btn is-small is-round form-section__continue-btn\"\n        ng-click=\"continue()\"\n        apl-scroll-next-section>\n      <span>Continue</span>\n      <span ng-if=\"counts.spots > 0\">to Spots</span>\n      <span ng-if=\"counts.spots == 0\">to Questions</span>\n    </a>\n  </div>\n</div>\n");
$templateCache.put("/views/apply/sections/questions.html","<div class=\"form-section trim\"\n    ng-controller=\"QuestionsCtrl\"\n    ng-class=\"{ \'is-disabled\':isDisabled() }\">\n  <div class=\"form-section__header\">\n    <div class=\"form-section__headline\">\n      Answer Questions\n    </div>\n    <div class=\"form-section__subline\">\n      Please provide answers to all required questions below.\n    </div>\n  </div>\n  <div class=\"form-section__content text-trim\">\n\n    <ul class=\"apply-questions\" apl-apply-focus>\n      <li class=\"apply-questions__item\"\n          ng-repeat=\"blueprint in blueprints\"\n          ng-class=\"{\n            \'is-valid\':blueprint._valid,\n            \'is-required\':blueprint.is_required,\n            \'is-empty\':blueprint._empty\n          }\">\n\n        <div class=\"apply-questions__item__container\"\n            ng-switch=\"blueprint.definition.type\">\n          <apl-blueprint-shorttext\n              ng-switch-when=\"shorttext\" apl-blueprint=\"blueprint\"></apl-blueprint-shorttext>\n          <apl-blueprint-dropdown\n              ng-switch-when=\"dropdown\" apl-blueprint=\"blueprint\"></apl-blueprint-dropdown>\n          <apl-blueprint-fileupload\n              class=\"blueprint--fileupload\"\n              ng-switch-when=\"fileupload\" apl-blueprint=\"blueprint\"></apl-blueprint-fileupload>\n          <apl-blueprint-multiplechoice\n              ng-switch-when=\"multiplechoice\" apl-blueprint=\"blueprint\"></apl-blueprint-multiplechoice>\n          <apl-blueprint-yesno\n              ng-switch-when=\"yesno\" apl-blueprint=\"blueprint\"></apl-blueprint-yesno>\n          <apl-blueprint-rating\n              class=\"blueprint--rating\"\n              ng-switch-when=\"rating\" apl-blueprint=\"blueprint\"></apl-blueprint-rating>\n          <apl-blueprint-name\n              class=\"blueprint--name\"\n              ng-switch-when=\"name\" apl-blueprint=\"blueprint\"></apl-blueprint-name>\n          <apl-blueprint-address\n              class=\"blueprint--address\"\n              ng-switch-when=\"address\" apl-blueprint=\"blueprint\"></apl-blueprint-address>\n          <apl-blueprint-legal\n              class=\"blueprint--legal\"\n              ng-switch-when=\"legal\" apl-blueprint=\"blueprint\"></apl-blueprint-legal>\n          <apl-blueprint-education\n              class=\"blueprint--education\"\n              ng-switch-when=\"education\" apl-blueprint=\"blueprint\"></apl-blueprint-education>\n          <apl-blueprint-workexperience\n              class=\"blueprint--workexperience\"\n              ng-switch-when=\"workexperience\" apl-blueprint=\"blueprint\"></apl-blueprint-workexperience>\n          <apl-blueprint-reference\n              class=\"blueprint--reference\"\n              ng-switch-when=\"reference\" apl-blueprint=\"blueprint\"></apl-blueprint-reference>\n          <apl-blueprint-email\n              class=\"blueprint--email\"\n              ng-switch-when=\"email\" apl-blueprint=\"blueprint\"></apl-blueprint-email>\n          <apl-blueprint-phonenumber\n              class=\"blueprint--phonenumber\"\n              ng-switch-when=\"phonenumber\" apl-blueprint=\"blueprint\"></apl-blueprint-phonenumber>\n          <apl-blueprint-socialsecuritynumber\n              class=\"blueprint--socialsecuritynumber\"\n              ng-switch-when=\"socialsecuritynumber\" apl-blueprint=\"blueprint\"></apl-blueprint-socialsecuritynumber>\n          <apl-blueprint-website\n              class=\"blueprint--website\"\n              ng-switch-when=\"website\" apl-blueprint=\"blueprint\"></apl-blueprint-website>\n          <apl-blueprint-date\n              class=\"blueprint--date\"\n              ng-switch-when=\"date\" apl-blueprint=\"blueprint\"></apl-blueprint-date>\n          <apl-blueprint-hourlyavailability\n              class=\"blueprint--hourlyavailability\"\n              ng-switch-when=\"hourlyavailability\" apl-blueprint=\"blueprint\"></apl-blueprint-hourlyavailability>\n          <apl-blueprint-longtext\n              ng-switch-default apl-blueprint=\"blueprint\"></apl-blueprint-longtext>\n        </div>\n\n      </li>\n    </ul>\n\n  </div>\n</div>\n");
$templateCache.put("/views/apply/sections/spots.html","<div class=\"form-section\"\n    ng-controller=\"SpotsCtrl\"\n    ng-class=\"{ \'is-disabled\':isDisabled() }\">\n  <div class=\"form-section__header\">\n    <div class=\"form-section__headline\">\n      Select Spots\n    </div>\n    <div class=\"form-section__subline\">\n      Select all spots that you are interested in applying.\n    </div>\n  </div>\n  <div class=\"form-section__content text-trim\">\n    <ul class=\"apply-spots\">\n      <li class=\"apply-spots__item\"\n          ng-repeat=\"(entity_id, spotObj) in spots\"\n          ng-if=\"spotObj.spots.length > 0\">\n\n        <div class=\"apply-spots__item__title\"\n            ng-if=\"counts.locations > 0\">\n          {{ spotObj.entity.name }}\n        </div>\n\n        <ul class=\"selection-list\">\n          <li class=\"selection-list__item\"\n              ng-repeat=\"spot in spotObj.spots\"\n              ng-class=\"{ \'is-selected\':spot.is_selected }\">\n\n            <div class=\"apply-spot selection-list__item__container\"\n                ng-click=\"toggleSpot(spot)\">\n              <span class=\"selection-list__check\">\n                <span class=\"icon-wrap\">\n                  <svg class=\"icon\">\n                    <use xlink:href=\"#checkmark-naked\" />\n                  </svg>\n                </span>\n              </span>\n              <span class=\"apply-spot__content\">\n                <div class=\"apply-spot__name\">\n                  {{ spot.name }}\n                </div>\n                <div class=\"apply-spot__description text-trim\"\n                    ng-if=\"spot.detail\"\n                    ng-bind-html=\"spot.detail | aplUnsafe\"></div>\n              </span>\n            </div>\n\n          </li>\n        </ul>\n      </li>\n    </ul>\n  </div>\n  <div class=\"form-section__tray al--center\">\n    <a href=\"\" class=\"btn is-small is-round form-section__continue-btn\"\n        ng-click=\"continue()\"\n        apl-scroll-next-section>\n      <span>Continue to Questions</span>\n    </a>\n  </div>\n</div>\n");}]);