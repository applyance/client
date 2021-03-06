'use strict';

module.exports = angular.module('Applyance')
  .directive('focusOn', function() {
    return function(scope, elem, attr) {
      scope.$on(attr.focusOn, function(e) {
        elem[0].focus();
      });
    };
  })
  .directive('aplFilesUpload', function() {
    return {
      scope: {
        aplFilesUpload: "=",
        aplFilesUploadOnChange: "&"
      },
      link: function (scope, element, attributes) {

        element.bind("change", function(changeEvent) {

          // Reset the files if it is not multiple
          if (!element.is('[multiple]')) {
            scope.aplFilesUpload.files = [];
          } else {
            scope.aplFilesUpload.files = scope.aplFilesUpload.files || [];
          }

          for (var i = 0; i < changeEvent.target.files.length; i++) {
            scope.aplFilesUpload.files.push(changeEvent.target.files[i]);
          }
          _.each(scope.aplFilesUpload.files, scope.massageFile);
          scope.aplFilesUploadOnChange();

          // Reset
          element.wrap('<form>').closest('form').get(0).reset();
          element.unwrap();
        });

        scope.onReadFile = function(file) {
          return function(readEvent) {
            file.dataUrl = readEvent.target.result;
          };
        };

        scope.massageFile = function(file) {
          file.isImage = file.type.lastIndexOf("image", 0) === 0;
          var dataUrlReader = new FileReader();
          dataUrlReader.onload = scope.onReadFile(file);
          dataUrlReader.readAsDataURL(file);
        };

      }
    }
  })
  .directive("fileread", function () {
    return {
      scope: {
        fileread: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          scope.$apply(function () {
            scope.fileread.files = changeEvent.target.files;
            scope.fileread.fileObj = changeEvent.target.files[0];
          });

          var dataUrlReader = new FileReader();
          dataUrlReader.onload = function(loadEvent) {
            scope.$apply(function () {
              if (!scope.fileread.attachment) {
                scope.fileread.attachment = {};
              }
              scope.fileread.attachment.url = loadEvent.target.result;
            });
          }
          dataUrlReader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  })
  .directive('aplTooltip', ['$document', function($document) {
    return {
      restrict: 'A',
      link: function(scope, elem, attr, ctrl) {

        var tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        document.body.appendChild(tooltip);

        var tether = null;
        elem.bind('mouseenter', function(e) {
          tooltip.innerHTML = attr.aplTooltip;
          tooltip.classList.add('is-open');
          tether = new Tether({
            element: tooltip,
            target: elem[0],
            attachment: attr.aplTooltipAttachment || 'top center',
            targetAttachment: attr.aplTooltipTargetAttachment || 'bottom center'
          });
        });

        elem.bind('mouseleave', function(e) {
          tooltip.classList.remove('is-open');
          tether.destroy();
        });

      }
    }
  }])
  .directive('aplDebounce', function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 99,
      link: function (scope, elm, attr, ngModelCtrl) {
        if (attr.type === 'radio' || attr.type === 'checkbox') {
          return;
        }

        var delay = parseInt(attr.ngDebounce, 10);
        if (isNaN(delay)) {
          delay = 1000;
        }

        elm.unbind('input');

        var debounce;
        elm.bind('input', function () {
          $timeout.cancel(debounce);
          debounce = $timeout(function () {
            scope.$apply(function () {
              ngModelCtrl.$setViewValue(elm.val());
            });
          }, delay);
        });
        elm.bind('blur', function () {
          scope.$apply(function () {
              ngModelCtrl.$setViewValue(elm.val());
          });
        });
      }
    };
  })
  .directive('aplAttrMultiple', ['$parse', function($parse) {
    return {
      link: function (scope, elm, attr) {
        attr.$observe('aplAttrMultiple', function(isMultiple) {
          isMultiple ? elm.attr('multiple', '') : elm.removeAttr('multiple');
        });
      }
    };
  }])
;
