var WechatBackupControllers = angular.module('WechatBackupControllers',[]);

WechatBackupControllers.controller('EntryController',function ($scope,$state) {
    $scope.page = "entry page";
    $scope.sqlFile = "/Users/shidanlifuhetian/All/Tdevelop/微信备份数据库/MM.sqlite";
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
    // $scope.projectFolder = "defaultFolder";
    // $scope.projectName = "defaultName";
    $scope.dbTables = [];
    $scope.totalTablesCount = -1;
    $scope.tableSelected = "";

    $scope.ChatListController = function () {
        console.log("constructor");
        // sqlite3相关文档：https://github.com/mapbox/node-sqlite3/wiki/API
        var sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        var db = new sqlite3.Database($scope.filePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });

        // 查找数据库内的所有table，并逐个遍历
         db.each("select * from SQLITE_MASTER where type = 'table'",function (error,row) {
             // 回调函数，没获取一个条目，执行一次，第二个参数为当前条目

             // 声明一个promise，将条目的name传入resolve
            let getRowName = new Promise(function (resolve,reject) {
                if(!error)
                {
                    //console.log("row name: ",row.name);
                    resolve(row.name);
                    // let sql = "select count(*) as count from "+ row.name;
                    // let r = db.get(sql,function (error,result) {
                    //     if(!error)
                    //         console.log("get:",result);
                    //     else
                    //         console.log("get error:",error);
                    // });
                    // console.log("row count: ",r);
                }else{
                    //console.log("row error:",error);
                    reject(error);
                }
            });
             // 声明一个带参数的promise，写法和getRowName略有不同
             var getCount = function (rowName) {
                 let promise = new Promise(function (resolve,reject) {
                     ///
                     let sql = "select count(*) as count from "+ rowName;
                     let r = db.get(sql,function (error,result) {
                         if(!error) {
                             //console.log("count:", result.count);
                             //将传入的rowName和结果的count数一并传出去
                             resolve([rowName,result.count]);
                         }
                         else {
                             console.log("count error:", error);
                             reject(error)
                         }
                     });
                     ///
                 });
                 return promise;
             };
             // 执行promise。
             // 先getRowName,然后每获取到一个rowName就传入到getCount函数内，接着一个.then().里面输出的就是rowName和count一一对应的数组
            getRowName
                .then(getCount)
                .then(function (result) {
                console.log("rowName:",result[0],"count:",result[1]);
                $scope.dbTables.push(result);
                    if($scope.dbTables.length == $scope.totalTablesCount){
                        console.log("scope apply,tables count:",$scope.dbTables.length)
                        $scope.$apply();
                    }
            });
        },function (error,result) {
            if(!error){
                $scope.totalTablesCount = result;
                console.log("completed total tables Count:",result);
                $scope.$apply();
            }else{
                console.log("complete error:",error);
            }
        });
    };

    $scope.onFilesSelected = function(files) {
        console.log("files - " + files);
    };
    $scope.filePath = $stateParams.sqliteFilePath;
    $scope.ChatListController();

    $scope.onChatTableSelected = function (tableName) {
        //alert(tableName);
        $scope.tableSelected = tableName;
    }
});