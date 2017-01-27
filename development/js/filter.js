/**
 * Created by shidanlifuhetian on 2017/1/27.
 */
var WechatBackupFilters = angular.module('WechatBackupFilters',[]);

WechatBackupFilters.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});