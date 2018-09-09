/**
 * Created by shidanlifuhetian on 2018/8/15.
 */
// chatList.html页面的controller
WechatBackupControllers.controller('ChatListController',["$scope","$state", "$stateParams",function ($scope,$state, $stateParams) {
    $scope.wechatUserList = [];
    $scope.meInfo={};
    $scope.roomInfo={};
    $scope.otherInfo={}
    $scope.everLoggedThisPhoneWchatUsersInfo ={};//index by md5
    $scope.dbTables = [];
    $scope.isChatRoom = [];
    $scope.myFriends = {};// index by md5 (of userName)
    $scope.totalTablesCount = -1;
    $scope.tableSelected = "";
    $scope.previewData = [];
    $scope.filePath = "";
    $scope.documentsPath = $stateParams.documentsPath;
    $scope.messageLimit = 100;

    $scope.parseMmsetting = function (mmsettingPath) {
        var fs = require('fs');
        var plist = require('plist');
        var command = "plutil -convert xml1 "+mmsettingPath;
        //console.log("command:",command);
        var stdOut = require('child_process').execSync( command,{// child_process会调用sh命令，pc会调用cmd.exe命令
            encoding: "utf8"
        } );

        var content = fs.readFileSync(mmsettingPath, 'utf8');
        var obj = plist.parse(content).$objects;
        var headUrl = "";
        // find headURL
        for (var i=0;i<obj.length;i++){
            if (typeof obj[i] == "string"){
                var pos1 = obj[i].indexOf('http://wx.qlogo.cn/');
                if (pos1==0 & obj[i].slice(-3)=='132'){
                    // console.log(obj[i])
                    headUrl = obj[i]
                }
            }
        }
        return {
            nickname:   obj[3], //昵称
            wechatID:   obj[19], //微信号
            headUrl:    headUrl, //头像1
        };
    };

    // "构造函数"，页面载入的时候执行
    $scope.ChatListController = function () {
        console.log("constructor");
        console.log($stateParams);
        // 1. 查看当前目录下的所有文件
        var fs = require('fs');
        var path = require('path');
        var documentsFileList = fs.readdirSync($scope.documentsPath);
        // 2. 找到符合md5格式的文件夹        // 3. 将这几个文件夹的显示在页面上
        for(var i=0;i<documentsFileList.length;i++)
        {
            //console.log(documentsFileList[i].length);
            if(documentsFileList[i].length == 32 && documentsFileList[i]!="00000000000000000000000000000000"){
                console.log(documentsFileList[i]);
                $scope.wechatUserList.push(documentsFileList[i]);
                var mmsettingPath = path.join($scope.documentsPath,documentsFileList[i],'mmsetting.archive')
                let myInfo = $scope.parseMmsetting(mmsettingPath)
                $scope.everLoggedThisPhoneWchatUsersInfo[documentsFileList[i]] = myInfo
            }
        }
        console.log($scope.everLoggedThisPhoneWchatUsersInfo)
    };
    // 执行"构造函数"
    $scope.ChatListController();

    // $scope.onFilesSelected = function(files) {
    //     console.log("files - " + files);
    // };
    $scope.onWechatUserMD5Selected = function(wechatUserMD5){
        var sqlite3 = require('sqlite3');

        console.log(wechatUserMD5);
        $scope.meInfo = $scope.everLoggedThisPhoneWchatUsersInfo[wechatUserMD5]
        $scope.meInfo['md5'] = wechatUserMD5
        $scope.dbTables =[];
        // var wechatUserNickname =
        // 1.   定位到当前目录的mmsqlite文件
        var sqlitefilePath = $scope.documentsPath + "/" + wechatUserMD5 + "/DB/MM.sqlite";
        var contactSqliteFilePath = $scope.documentsPath + "/" + wechatUserMD5 +"/DB/WCDB_Contact.sqlite";

        var contactDb = new sqlite3.Database(contactSqliteFilePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });

        contactDb.each("select * from Friend;",function (error,row) {
            // 回调函数，每获取一个条目，执行一次，第二个参数为当前条目
            var md5 = require('js-md5');

            var nameMd5 = md5(row.userName);
            $scope.myFriends[nameMd5] = {
                wechatID:row.userName,
                nickName:getNickName(Utf8ArrayToStr(row.dbContactRemark))
            };

            //console.log(row.dbContactRemark);
            //console.log(Utf8ArrayToStr(row.dbContactRemark));
        },function (error, result) {
            console.log('names over:',result);
            console.log('names size:',$scope.myFriends.length);
        });

        $scope.filePath = sqlitefilePath;
        // sqlite3相关文档：https://github.com/mapbox/node-sqlite3/wiki/API

        //var sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        var db = new sqlite3.Database(sqlitefilePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });
        console.log("myFriends Size:",$scope.myFriends.length);
        // 查找数据库内的所有table，并逐个遍历
        db.each("select * from SQLITE_MASTER where type = 'table' and name like 'Chat/_%' ESCAPE '/' ;",function (error,row) {
            // 回调函数，每获取一个条目，执行一次，第二个参数为当前条目
            // 声明一个promise，将条目的name传入resolve
            var getRowName = new Promise(function (resolve,reject) {
                if(!error)
                {
                    resolve(row.name);
                }else{
                    reject(error);
                }
            });
            // 声明一个带参数的promise，写法和getRowName略有不同
            var getCount = function (rowName) {
                var promise = new Promise(function (resolve,reject) {
                    var sql = "select count(*) as count from "+ rowName;
                    var r = db.get(sql,function (error,result) {
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
                });
                return promise;
            };
            // 执行promise。
            // 先getRowName,然后每获取到一个rowName就传入到getCount函数内，接着一个.then().里面输出的就是rowName和count一一对应的数组
            getRowName
                .then(getCount)
                .then(function (result) {
                    db.get("select count(*) as count,MesSvrID as serverID from "+result[0],function (error, row) {
                        //console.log(row);
                        if(!(row.count <= $scope.messageLimit))
                        {
                            // result[0] : table name // result[1] : table count
                            var currentChatterMd5 = getChatterMd5(result[0]);
                            //result.push(currentChatterMd5);
                            //console.log("nickNames Size here:",$scope.myFriends);
                            console.log("rowName:",result[0],
                                "count:",result[1],
                                " md5:",currentChatterMd5,
                                " nickname:",$scope.myFriends[currentChatterMd5].nickName,
                                "userName: ",$scope.myFriends[currentChatterMd5].wechatID);
                            result.push($scope.myFriends[currentChatterMd5].nickName);

                            $scope.dbTables.push(result);
                            if ($scope.myFriends[currentChatterMd5].wechatID.indexOf('@chatroom') == -1){
                                $scope.isChatRoom[currentChatterMd5]=false
                            }else{
                                $scope.isChatRoom[currentChatterMd5]=true
                            }
                            // if($scope.dbTables.length == $scope.totalTablesCount){
                            //     console.log("scope apply1,tables count:",$scope.dbTables.length)
                            //     $scope.$apply();
                            // }
                        }
                        $scope.$apply();
                    });
                });
        },function (error,result) {
            if(!error){
                $scope.totalTablesCount = result;
                console.log("completed total tables Count:",result);
            }else{
                console.log("complete error:",error);
            }
        });
    };
    // 用户在左侧选择了具体table
    $scope.onChatTableSelected = function (tableIndex) {
        console.log('isChatroom: ',$scope.isChatRoom);
        console.log($scope.dbTables[tableIndex])
        $scope.tableSelected = {
            md5:getChatterMd5($scope.dbTables[tableIndex][0]),
            tableName:$scope.dbTables[tableIndex][0],
            roomName:$scope.dbTables[tableIndex][2][0],
            isChatRoom:$scope.isChatRoom[$scope.dbTables[tableIndex][0].split('_')[1]]
        };
        $scope.previewData = [];
        // sqlite3相关文档：https://github.com/mapbox/node-sqlite3/wiki/API
        var sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        var db = new sqlite3.Database($scope.filePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });

        var sql = "SELECT * FROM "+$scope.tableSelected['tableName']+" order by CreateTime desc limit 10";
        db.all(sql, function(err, rows) {
            for(var i in rows){
                var time = formatTimeStamp(rows[i].CreateTime)
                //console.log(time);
                $scope.previewData.push({
                    time:time,
                    message:rows[i].Message
                })
            }
            //console.log("scope apply,previewData count:",$scope.previewData.length)
            $scope.$apply();
        });
        $scope.addOtherChattersInfo();

    };
    $scope.addOtherChattersInfo = function () {
        console.log("Enter addOtherChattersInfo")
        var sqlite3 = require('sqlite3');
        var fs = require('fs')
        $scope.currentFriend = $scope.myFriends[getChatterMd5($scope.tableSelected['md5'])];

        if ($scope.tableSelected.isChatRoom){
            console.log("群组聊天")

            //群组聊天
        }else{
            console.log("一对一聊天")
            //一对一聊天
            var meMD5 = $scope.meInfo['md5']
            var contactSqliteFilePath = $scope.documentsPath + "/" + meMD5 +"/DB/WCDB_Contact.sqlite";
            var contactDb = new sqlite3.Database(contactSqliteFilePath,sqlite3.OPEN_READONLY,function (error) {
                if (error){
                    console.log("Database error:",error);
                }
            });
            var sql = "select dbContactHeadImage,lower(quote(dbContactRemark)) as cr from Friend where userName is '"+$scope.currentFriend.wechatID+"';";
           contactDb.get(sql,function (err, row) {
               console.log('other detail:',row)
               console.log(row.dbContactHeadImage.toString('utf8'))
               console.log(row.cr)
               var tmp = row.dbContactHeadImage.toString('utf8')
               var i = tmp.indexOf("/132")
               var b = tmp.slice(0,i+4)
               var i2 = b.indexOf('http:')
               var c = b.slice(i2)
               var user_name = decode_user_name_info(row.cr)
               console.log(user_name)
               // fs.writeFile('./contact remark.txt', row.dbContactRemark, (err) => {
               //     if (err) throw err;
               //     console.log('The file has been saved!');
               // });
               // var nn2 = getNickName(t)
               $scope.otherInfo[$scope.currentFriend.wechatID]={
                   wechatID:$scope.currentFriend.wechatID,
                   headUrl:c,
                   nickName:user_name//getNickName(row.dbContactRemark)
               }
           })
        }
    };
    $scope.goToSoft2 = function () {
        $state.go('soft2',{
            documentsPath:$scope.documentsPath,
            meInfo:JSON.stringify($scope.meInfo),
            otherInfo:JSON.stringify($scope.otherInfo),
            roomInfo:JSON.stringify($scope.tableSelected)
        });
        /*
        * {
         "meInfo": {
             "nickname": "",
             "wechatID": "",
             "headUrl": "",
             "md5": "4ff9910cd14885aa373c45c4b7909ba7"
             },
         "otherInfo": {
             "wxid_53lvynmdwu9x22":{
             "wechatID": "wxid_53lvynmdwu9x22",
             "nickName": ["\n\t马小江\u0012\u0000\u001a\u0000"]
             "hearUrl": ""
             },
             {
             }
         },
         "roomInfo":{
                "tableName":"Chat_f91b322ba073c8414b68060660ac893c"
                "md5":"f91b322ba073c8414b68060660ac893c"
                "isChatRoom":true,
                "roomName":""
             }
         }
        *
        *
        *
        * */
    }
}]);