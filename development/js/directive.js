/**
 * Created by shidanlifuhetian on 2016/12/30.
 */
// 指令
var WechatBackupDirectives = angular.module('WechatBackupDirectives',[]);

WechatBackupDirectives.directive("hello",function () {
    return {
        restrict:"E",
        template:"<div> I'm test...</div>",
        replace:true
    }
});
WechatBackupDirectives.directive('onFileChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.onFileChange);

            element.bind('change', function() {
                scope.$apply(function() {
                    var files = element[0].files;
                    if (files) {
                        onChangeHandler(files);
                    }
                });
            });

        }
    };
});
WechatBackupDirectives.directive('testD', function (){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function(newValue) {
                console.log(newValue);
            });
        }
    };
});