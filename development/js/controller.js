var WechatBackupControllers = angular.module('WechatBackupControllers',[]);

WechatBackupControllers.controller('EntryController',function ($scope,$state) {
    $scope.page = "entry page";
    $scope.sqlFile = "sqlFilePath";
    $scope.onFileChange = function (files) {
        console.log(files);
        $scope.sqlFile = files[0].path;
    };
    $scope.importSqliteFile = function (sqliteFilePath) {
        // 使用ui-router实现页面跳转
        $state.go('chatList',{sqliteFilePath:sqliteFilePath});
    }

});

WechatBackupControllers.controller('ChatListController',function ($scope,$state, $stateParams) {
    $scope.projectFolder = "defaultFolder";
    $scope.projectName = "defaultName";
    $scope.onFilesSelected = function(files) {
        console.log("files - " + files);
    };
    $scope.filePath = $stateParams.sqliteFilePath;
    $scope.onBtnClick = function () {
        console.log("btn clicked");
        //$state.go('entry');
        // 引用sqlite3
        var sqlite3 = require('sqlite3').verbose();

        var db = new sqlite3.Database('/tmp/1.db',function() {
            db.run("create table test(name varchar(15))",function(){
                db.run("insert into test values('hello,world')",function(){
                    db.all("select * from test",function(err,res){
                        if(!err)
                            console.log(JSON.stringify(res));
                        else
                            console.log(err);
                    });
                })
            });
        });
    }
});