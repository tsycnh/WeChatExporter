var WechatBackupControllers = angular.module('WechatBackupControllers',[]);
WechatBackupControllers.controller('EntryController',["$scope","$state",function ($scope,$state) {
    $scope.page = "entry page";
    $scope.dPath = "";
    $scope.otherNickNames = {};
    $scope.onFileChange = function (files) {
        console.log(files);
        $scope.sqlFile = files[0].path;
    };
    $scope.loadDocuments = function (documentsPath) {
        console.log(documentsPath);
        $state.go('chatList',{documentsPath:documentsPath});
    };
    $scope.EntryController = function () {
        console.log("entry controller constructor");
    };
    $scope.EntryController();
}]);
WechatBackupControllers.controller('TopBarController',["$scope","$rootScope",function ($scope,$rootScope) {
}]);
// chatList.html页面的controller
WechatBackupControllers.controller('ChatListController',["$scope","$state", "$stateParams",function ($scope,$state, $stateParams) {
    $scope.wechatUserList = [];
    $scope.wechatUserSelected = "";
    $scope.dbTables = [];
    $scope.otherNickNames = {};
    $scope.totalTablesCount = -1;
    $scope.tableSelected = "";
    $scope.previewData = [];
    $scope.filePath = "";
    $scope.documentsPath = $stateParams.documentsPath;

    // "构造函数"，页面载入的时候执行
    $scope.ChatListController = function () {
        console.log("constructor");
        console.log($stateParams);
        // 1. 查看当前目录下的所有文件
        var fs = require('fs');
        var documentsFileList = fs.readdirSync($scope.documentsPath);
        // 2. 找到符合md5格式的文件夹        // 3. 将这几个文件夹的显示在页面上
        for(var i=0;i<documentsFileList.length;i++)
        {
            //console.log(documentsFileList[i].length);
            if(documentsFileList[i].length == 32 && documentsFileList[i]!="00000000000000000000000000000000"){
                console.log(documentsFileList[i]);
                $scope.wechatUserList.push(documentsFileList[i]);
            }
        }
    };
    // 执行"构造函数"
    $scope.ChatListController();

    $scope.onFilesSelected = function(files) {
        console.log("files - " + files);
    };
    $scope.onWechatUserMD5Selected = function(wechatUserMD5){
        console.log(wechatUserMD5);
        $scope.wechatUserSelected = wechatUserMD5;
        $scope.dbTables =[];
        // 1.   定位到当前目录的mmsqlite文件
        var sqlitefilePath = $scope.documentsPath + "/" + wechatUserMD5 + "/DB/MM.sqlite";
        var contactSqliteFilePath = $scope.documentsPath + "/" + wechatUserMD5 +"/DB/WCDB_Contact.sqlite";

        var sqlite3 = require('sqlite3');

        var contactDb = new sqlite3.Database(contactSqliteFilePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });

        contactDb.each("select * from Friend;",function (error,row) {
            // 回调函数，每获取一个条目，执行一次，第二个参数为当前条目
            var md5 = require('js-md5');

            var nameMd5 = md5(row.userName);
            //console.log(row.userName,nameMd5);
            $scope.otherNickNames[nameMd5] = {wechatID:row.userName,nickName:getNickName(Utf8ArrayToStr(row.dbContactRemark))};

            //console.log(row.dbContactRemark);
            //console.log(Utf8ArrayToStr(row.dbContactRemark));
        },function (error, result) {
            console.log('names over:',result);
            console.log('names size:',$scope.otherNickNames.length);
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
        console.log("nickNames Size:",$scope.otherNickNames.length);
        // 查找数据库内的所有table，并逐个遍历
        db.each("select * from SQLITE_MASTER where type = 'table' and name like 'Chat/_%' ESCAPE '/' ;",function (error,row) {
            // 回调函数，没获取一个条目，执行一次，第二个参数为当前条目

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
                    ///
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
                    ///
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
                        if(!(row.count <= 100))
                        {
                            // result[0] : table name // result[1] : table count
                            var currentChatterMd5 = getChatterMd5(result[0]);
                            //result.push(currentChatterMd5);
                            //console.log("nickNames Size here:",$scope.otherNickNames);
                            console.log("rowName:",result[0],"count:",result[1]," md5:",currentChatterMd5," user Name:",$scope.otherNickNames[currentChatterMd5].nickName);
                            result.push($scope.otherNickNames[currentChatterMd5].nickName);

                            $scope.dbTables.push(result);
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
    $scope.onChatTableSelected = function (tableName) {
        //alert(tableName);
        $scope.tableSelected = tableName;
        $scope.previewData = [];
        // sqlite3相关文档：https://github.com/mapbox/node-sqlite3/wiki/API
        var sqlite3 = require('sqlite3');
        // 打开一个sqlite数据库
        var db = new sqlite3.Database($scope.filePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });

        var sql = "SELECT * FROM "+$scope.tableSelected+" order by CreateTime desc limit 10";
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
    };

    $scope.exportChat = function (tableName) {
        $state.go('chatDetail',{tableName:tableName,sqliteFilePath:$stateParams.sqliteFilePath});
    }
}]);
// chatDetail.html页面的controller
WechatBackupControllers.controller('ChatDetailController',["$scope","$state", "$stateParams",function ($scope, $state, $stateParams) {

    $scope.tableName = $stateParams.tableName;
    $scope.filePath = $stateParams.sqliteFilePath; //sqlite 文件路径
    $scope.folderPath = "";     // 备份根路径，精确到md5
    $scope.imgFolderPath = "";  // 图像路径
    $scope.audioFolderPath = "";// 语音路径
    $scope.videoFolderPath = "";// 视频路径
    $scope.meMd5 = "";          // 我的Md5值
    $scope.chatterMd5 = "";     // 聊天者的Md5值
    $scope.chatData = [];
    $scope.scrollToBottom = -1;
    $scope.count = 0;
    $scope.db = {};             // 数据库
    $scope.limitStart = 0;      // 加载起始位置（包含）
    $scope.limitGap = 50;       // 每次加载limitGap条消息，默认50

    //检测是否存在音频解码器
    $scope.audioDecoderExist = function () {
        var fs = require('fs');

        if(!fs.existsSync($scope.audioFolderPath+"/converter.sh")) return false;
        if(!fs.existsSync($scope.audioFolderPath+"/ffmpeg")) return false;
        if(!fs.existsSync($scope.audioFolderPath+"/silk/decoder")) return false;
        if(!fs.existsSync($scope.audioFolderPath+"/silk/libSKP_SILK_SDK.a")) return false;

        return true;

    };
    // 加载聊天记录
    $scope.loadMore = function () {
        var sql = "SELECT * FROM "+$scope.tableName+" order by CreateTime limit "+$scope.limitStart+","+$scope.limitGap;
        $scope.db.all(sql, function(err, rows) {
            for (var i in rows){
                var message = {
                    owner:rows[i].Des,
                    content:""
                };
                switch(rows[i].Type)
                {
                    case 1:// 文字消息
                        message.content = templateMessage(rows[i]);
                        break;
                    case 3:// 图片消息
                        message.content = $scope.templateImage(rows[i]);
                        break;
                    case 34:// 语音消息
                        message.content = $scope.templateAudio(rows[i]);
                        break;
                    case 43:// 视频消息
                        message.content = $scope.templateImage(rows[i]);
                        break;
                    case 62:// 小视频消息
                        message.content = $scope.templateVideo(rows[i]);
                        break;
                    case 47:// 动画表情
                        message.content = "动画表情";
                        break;
                    case 49:// 分享链接
                        message.content = "分享链接";
                        break;
                    case 48:// 位置
                        message.content = "位置";
                        break;
                    case 42:// 名片
                        message.content = "名片";
                        break;
                    case 50:// 语音、视频电话
                        message.content = "语音、视频电话";
                        break;
                    default:
                        message.content = "未知消息类型：type id:"+rows[i].Type;
                }
                $scope.chatData.push(message);
            }
            //$scope.chatData = rows;
            //console.log("scope apply,chatData:",$scope.chatData);
            $scope.$apply();
            $scope.limitStart += $scope.limitGap;
        });
    };
    // 构造函数
    $scope.ChatDetailController = function () {
        //console.log("enter ChatDetailController");
        // /Users/shidanlifuhetian/All/Tdevelop/微信备份数据库/微信2017年01月07日备份/Documents/4ff9910cd14885aa373c45c4b7909ba7/DB/MM.sqlite
        // 初始化各种路径
        $scope.folderPath = getFolderPath($scope.filePath);
        //console.log($scope.folderPath);
        $scope.meMd5 = getMyMd5($scope.folderPath);
        $scope.chatterMd5 = getChatterMd5($scope.tableName);
        console.log($scope.meMd5);
        $scope.imgFolderPath = $scope.folderPath + "Img/" + $scope.chatterMd5 + "/";
        $scope.audioFolderPath = $scope.folderPath + "Audio/" + $scope.chatterMd5 + "/";
        $scope.videoFolderPath = $scope.folderPath + "Video/" + $scope.chatterMd5 + "/";
        var sqlite3 = require('sqlite3');
        // 拷贝silk-v3-decoder至对应的Audio文件夹
        // 打开一个sqlite数据库
        var db = new sqlite3.Database($scope.filePath,sqlite3.OPEN_READONLY,function (error) {
            if (error){
                console.log("Database error:",error);
            }
        });
        $scope.db = db;

        if($scope.audioDecoderExist())
        {
            $scope.loadMore();// 载入数据库内容

        }else{
            var fse = require('fs-extra');

            // 拷贝silk-v3-decoder 的内容到目标文件夹内
            var srcPath = './framework/silk-v3-decoder'; //current folder
            var destPath = $scope.audioFolderPath; //
            console.log("开始拷贝silk-vs-decoder文件夹");

            fse.copy(srcPath, destPath, function (err) {
                if (err) return console.error(err)
                console.log('拷贝silk-vs-decoder成功!')
                $scope.loadMore();// 载入数据库内容

            });// copies directory, even if it has subdirectories or files
        }
    };
    $scope.ChatDetailController();
    $scope.inputChange = function () {
        console.log("input Change");
    };

    $scope.$watch('scrollToBottom',function (newValue,oldValue) {
        $scope.count++;
        console.log("angular detect scroll,count:",$scope.count);
        console.log("new:",newValue," old:",oldValue);
        //$scope.$apply();
    });



    $scope.templateImage = function (row) {
        var fs = require('fs');
        var data = fs.readFileSync($scope.imgFolderPath+row.MesLocalID+".pic_thum");

        var imgTag = "<img>";
        if(data != undefined) {
            var a = data.toString("base64");
            imgTag = "<img src='data:image/jpeg;base64," + a + "'/>";
        }
        return imgTag;
    };
    $scope.templateAudio = function (row) {
        var fs = require('fs');
        //var data = fs.readFileSync($scope.audioFolderPath+"/"+row.MesLocalID+".mp3");
        var audioFilePath = $scope.audioFolderPath+row.MesLocalID+".mp3";
        var audioTag = "<audio></audio>";
        if(fs.existsSync(audioFilePath))// 若wav文件存在
        {
            audioTag = "<audio src='file://"+audioFilePath+"' controls='controls'></audio>";
        }else{
            var command = $scope.audioFolderPath + "converter.sh "+row.MesLocalID + ".aud mp3";
            var stdOut = require('child_process').execSync( command,{// child_process会调用sh命令，pc会调用cmd.exe命令
                encoding: "utf8"
            } );
            console.log(stdOut);
            if(stdOut.indexOf("[OK]") > 0)// 存在OK,即转换成功
            {
                audioTag = "<audio src='file://"+audioFilePath+"' controls='controls'></audio>";
            }else {
                audioTag = "[语音读取出错]";
            }
        }
        return audioTag;
    };
    $scope.templateVideo = function (row) {
        console.log("load a video: ",$scope.videoFolderPath+row.MesLocalID+".mp4")
        var fs = require('fs');
        var videoFilePath = $scope.videoFolderPath+row.MesLocalID+".mp4";
        var videoTag = "<video></video>";
        if(fs.existsSync(videoFilePath))// 若文件存在
        {
            videoTag = "<video src='file://"+videoFilePath+"' controls='controls'></video>";
        }else{
            // var data = fs.readFileSync($scope.videoFolderPath + row.MesLocalID + ".video_thum");
            // if(data != undefined) {
            //     var a = data.toString("base64");
            //     videoTag = "<img src='data:image/jpeg;base64," + a + "'/>";
            // }
            // var command = $scope.audioFolderPath + "converter.sh "+row.MesLocalID + ".aud mp3";
            // var stdOut = require('child_process').execSync( command,{// child_process会调用sh命令，pc会调用cmd.exe命令
            //     encoding: "utf8"
            // } );
            // console.log(stdOut);
            // if(stdOut.indexOf("[OK]") > 0)// 存在OK,即转换成功
            // {
            //     videoTag = "<video src='file://"+videoFilePath+"' controls='controls'></video>";
            // }else {
            //     videoTag = "[语音读取出错]";
            // }
            videoTag = "【视频不存在】";
        }
        return videoTag;
    }


}]);

// useful functions
function add0(m){return m<10?'0'+m:m }

function formatTimeStamp(timeStamp) {
    var time = new Date(timeStamp*1000);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

function templateMessage(row) {
    return row.Message;
}

// 获取目录路径,返回值包括斜线形如："/abc/bsd/to/"
function getFolderPath(sqliteFilePath) {
    console.log(sqliteFilePath);
    var sep = sqliteFilePath.split("/");
    sep.pop();
    sep.pop();
    var folderPath = sep.join("/");
    return folderPath+="/";
}
function getMyMd5(folderPath) {
    var sep = folderPath.split("/");
    sep.pop();
    return sep.pop();
}
function getChatterMd5(tableName) {
    var sep = tableName.split("_");
    return sep.pop();
}
function getNickName(fullNameInfo) {
    var sep = fullNameInfo.split("\"");
    sep.pop();
    return sep;
}
function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
        c = array[i++];
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
            case 12: case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}