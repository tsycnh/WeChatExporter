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
})
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